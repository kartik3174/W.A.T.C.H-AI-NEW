// Seed animal data into Firebase Realtime Database
// Run with: node scripts/seed-animals-firebase.mjs

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

const animals = {
  "ELE-001": {
    tagId: "ELE-001",
    name: "Jumbo",
    species: "African Elephant",
    gender: "Male",
    age: 25,
    healthStatus: "Healthy",
    lastSeen: "2026-08-13T11:09:43+05:30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "LION-001": {
    tagId: "LION-001",
    name: "Simba",
    species: "Lion",
    gender: "Male",
    age: 8,
    healthStatus: "Healthy",
    lastSeen: "2026-08-13T11:09:43+05:30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "TIGER-001": {
    tagId: "TIGER-001",
    name: "Rajah",
    species: "Bengal Tiger",
    gender: "Male",
    age: 12,
    healthStatus: "Healthy",
    lastSeen: "2026-08-13T11:09:43+05:30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "RHINO-001": {
    tagId: "RHINO-001",
    name: "Kali",
    species: "Black Rhino",
    gender: "Female",
    age: 18,
    healthStatus: "Monitored",
    lastSeen: "2026-08-13T11:09:43+05:30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "GORILLA-001": {
    tagId: "GORILLA-001",
    name: "Kali",
    species: "Western Lowland Gorilla",
    gender: "Male",
    age: 30,
    healthStatus: "Healthy",
    lastSeen: "2026-08-13T11:09:43+05:30",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

async function seedAnimals() {
  console.log("🚀 Seeding animal data into Firebase Realtime Database...\n");

  try {
    await set(ref(db, "animals"), animals);

    for (const [id, data] of Object.entries(animals)) {
      console.log(`✅ Added: ${id} — ${data.name} (${data.species})`);
    }

    console.log("\n🎉 All animals seeded successfully into Realtime Database!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding data:", error.message);
    process.exit(1);
  }
}

seedAnimals();
