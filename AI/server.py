from ultralytics import YOLO
from fastapi import FastAPI, UploadFile
import shutil

app = FastAPI()

model = YOLO("best.pt")

@app.post("/detect")
async def detect(file: UploadFile):

    path = "temp.jpg"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    results = model(path)

    detections = []

    for r in results:
        for box in r.boxes:
            cls_id = int(box.cls)
            label = model.names[cls_id]
            confidence = float(box.conf)

            detections.append({
                "label": label,
                "confidence": confidence
            })

    return {"detections": detections}