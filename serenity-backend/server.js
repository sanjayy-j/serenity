import express from "express";
import cors from "cors";
import { db } from "./firebase.js"; // Adjust path as needed
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin using env (service account can be optional with application default or via env creds)
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    });
  } catch (e) {
    console.warn("Firebase Admin init warning:", e?.message || e);
  }
}

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your React frontend

async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
    if (!token) return res.status(401).json({ message: "Missing auth token" });
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (e) {
    console.error("Auth verify failed:", e?.message || e);
    return res.status(401).json({ message: "Invalid auth token" });
  }
}

app.get("/", (req, res) => {
  res.send("Serenity Backend is running!");
});

// Appointment Booking Endpoint
app.post("/api/appointments/book", async (req, res) => {
  try {
    const appointmentData = req.body;
    const newAppointment = { ...appointmentData, createdAt: new Date() };
    const docRef = await addDoc(collection(db, "appointments"), newAppointment);
    console.log("Appointment booked with ID: ", docRef.id);
    res.status(201).json({ message: "Appointment booked successfully!", appointmentId: docRef.id });
  } catch (e) {
    console.error("Error booking appointment: ", e);
    res.status(500).json({ message: "Failed to book appointment. Please try again later." });
  }
});

// Community Articles Endpoints
app.get("/api/community/articles", async (req, res) => {
  try {
    const q = query(collection(db, "articles"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    const articles = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.json({ articles });
  } catch (e) {
    console.error("Error fetching articles:", e);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

app.post("/api/community/articles", verifyAuth, async (req, res) => {
  try {
    const { title, content, author } = req.body || {};
    if (!title || !content) {
      return res.status(400).json({ message: "title and content are required" });
    }
    const article = {
      title: String(title).slice(0, 160),
      content: String(content).slice(0, 8000),
      author: author ? String(author).slice(0, 80) : (req.user?.email || "Anonymous"),
      uid: req.user?.uid || null,
      createdAt: new Date()
    };
    const docRef = await addDoc(collection(db, "articles"), article);
    res.status(201).json({ message: "Article created", id: docRef.id });
  } catch (e) {
    console.error("Error creating article:", e);
    res.status(500).json({ message: "Failed to create article" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});