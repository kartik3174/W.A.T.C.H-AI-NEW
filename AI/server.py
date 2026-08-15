import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from ultralytics import YOLO

app = FastAPI(title="W.A.T.C.H. YOLO AI Detection Service")

# Allow CORS for direct or proxied requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load custom YOLO model
try:
    model = YOLO("best.pt")
except Exception as e:
    print(f"[WARN] Failed to load best.pt, falling back to yolov8n.pt: {e}")
    model = YOLO("yolov8n.pt")


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model": "YOLO",
        "classes": list(model.names.values()) if hasattr(model, "names") else [],
    }


@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    try:
        # Read image bytes directly into memory (thread-safe, no disk race condition)
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Run inference in-memory
        results = model(image)

        detections = []
        for r in results:
            for box in r.boxes:
                cls_id = int(box.cls)
                label = model.names[cls_id]
                confidence = float(box.conf)
                xyxy = box.xyxy[0].tolist() if hasattr(box, "xyxy") else []

                detections.append({
                    "label": label,
                    "confidence": round(confidence, 4),
                    "box": {
                        "x1": round(xyxy[0], 1) if len(xyxy) > 0 else 0,
                        "y1": round(xyxy[1], 1) if len(xyxy) > 1 else 0,
                        "x2": round(xyxy[2], 1) if len(xyxy) > 2 else 0,
                        "y2": round(xyxy[3], 1) if len(xyxy) > 3 else 0,
                    }
                })

        return {
            "success": True,
            "count": len(detections),
            "detections": detections
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")