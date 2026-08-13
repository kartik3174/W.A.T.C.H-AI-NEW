// Seed cameras + alerts data into Firebase Realtime Database
// Run with: node scripts/seed-cameras-alerts-firebase.mjs

import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAlwQcmZ1MXSET8KhbccoHYPqP90810UW8",
  authDomain: "watch-ai-new-29939.firebaseapp.com",
  databaseURL: "https://watch-ai-new-29939-default-rtdb.firebaseio.com",
  projectId: "watch-ai-new-29939",
  storageBucket: "watch-ai-new-29939.firebasestorage.app",
  messagingSenderId: "1075469898956",
  appId: "1:1075469898956:web:fe2c2cc22c2bb0a34d5e69",
  measurementId: "G-8TQKYTBDVR",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ── CAMERAS ──────────────────────────────────────────────────────────────────
const cameras = {
  "1": {
    id: 1,
    name: "Ridge Point Camera",
    location: "Rocky ridge overlooking watering hole",
    type: "Motion-Activated",
    status: "Active",
    threshold: 45,
    lastMaintenance: "2024-02-01",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "2": {
    id: 2,
    name: "Watering Hole Monitor",
    location: "Primary watering hole",
    type: "24/7 Recording",
    status: "Active",
    threshold: 60,
    lastMaintenance: "2024-01-28",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "3": {
    id: 3,
    name: "Forest Trail Cam",
    location: "Dense forest pathway",
    type: "Motion-Activated",
    status: "Active",
    threshold: 35,
    lastMaintenance: "2024-01-15",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "4": {
    id: 4,
    name: "Perimeter Guard",
    location: "Fence perimeter monitoring",
    type: "Night Vision",
    status: "Active",
    threshold: 50,
    lastMaintenance: "2024-02-05",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "5": {
    id: 5,
    name: "Gorilla Sanctuary Cam",
    location: "Protected gorilla habitat",
    type: "Wildlife Documentary",
    status: "Active",
    threshold: 40,
    lastMaintenance: "2024-01-20",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// ── ALERTS ───────────────────────────────────────────────────────────────────
const alerts = {
  "1": {
    id: 1,
    type: "Poaching Risk",
    severity: "Critical",
    animal: "Jumbo",
    message: "Suspicious vehicle detected near elephant habitat in North Ridge",
    location: "North Ridge, Sector 2",
    createdAt: "2026-08-13T09:23:57+05:30",
    status: "Active",
    resolved: false,
    updatedAt: new Date().toISOString(),
  },
  "2": {
    id: 2,
    type: "Health Issue",
    severity: "High",
    animal: "Simba",
    message: "Elevated body temperature detected in lion",
    location: "West Reserve",
    createdAt: "2026-08-13T07:23:57+05:30",
    status: "Active",
    resolved: false,
    updatedAt: new Date().toISOString(),
  },
  "4": {
    id: 4,
    type: "Camera Failure",
    severity: "Medium",
    animal: "Rajah",
    message: "Motion sensor camera offline in sector 5",
    location: "Sector 5, Ridge Trail",
    createdAt: "2026-08-13T10:23:57+05:30",
    status: "Active",
    resolved: false,
    updatedAt: new Date().toISOString(),
  },
  "5": {
    id: 5,
    type: "Intrusion Alert",
    severity: "High",
    animal: "Kali",
    message: "Unauthorized human detected in protected gorilla sanctuary area",
    location: "Gorilla Sanctuary",
    createdAt: "2026-08-13T10:53:57+05:30",
    status: "Active",
    resolved: false,
    updatedAt: new Date().toISOString(),
  },
};

// ── SEED ─────────────────────────────────────────────────────────────────────
async function seedData() {
  console.log("🚀 Seeding Cameras & Alerts into Firebase Realtime Database...\n");

  try {
    // Seed Cameras
    await set(ref(db, "cameras"), cameras);
    console.log("📷 Cameras added:");
    for (const [id, cam] of Object.entries(cameras)) {
      console.log(`   ✅ #${id} — ${cam.name} (${cam.type}) @ ${cam.location}`);
    }

    // Seed Alerts
    await set(ref(db, "alerts"), alerts);
    console.log("\n🚨 Alerts added:");
    for (const [id, alert] of Object.entries(alerts)) {
      console.log(`   ✅ #${id} — [${alert.severity}] ${alert.type} | ${alert.animal} | ${alert.location}`);
    }

    console.log("\n🎉 All data seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

seedData();
