import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDBSg3st-olAfGTPrIbwsKKu2kuERxV5qY",
  authDomain: "hackhub-5cdc0.firebaseapp.com",
  projectId: "hackhub-5cdc0",
  storageBucket: "hackhub-5cdc0.firebasestorage.app",
  messagingSenderId: "544423456644",
  appId: "1:544423456644:web:858020649c47cbdc12f7d1",
  measurementId: "G-QDQ7W7Z12T"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const hackathons = [
  { title: "Global AI Hack 2026", status: "Upcoming", participants: 150, date: new Date("2026-06-10") },
  { title: "FinTech Disrupt", status: "Ongoing", participants: 85, date: new Date("2026-03-28") },
  { title: "Sustainability Jam", status: "Upcoming", participants: 200, date: new Date("2026-07-22") },
  { title: "Cyber Security Shield", status: "Completed", participants: 110, date: new Date("2026-01-15") },
  { title: "Web3 Builders Week", status: "Ongoing", participants: 340, date: new Date("2026-03-25") }
];

async function seed() {
  console.log("🚀 Starting data upload...");
  const colRef = collection(db, "hackathons");

  for (const hackathon of hackathons) {
    try {
      await addDoc(colRef, hackathon);
      console.log(`✅ Added: ${hackathon.title}`);
    } catch (e) {
      console.error("❌ Error: ", e);
    }
  }
  console.log("✨ Done!");
  process.exit();
}

seed();