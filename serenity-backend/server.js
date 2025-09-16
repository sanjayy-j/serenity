import express from "express";
import cors from "cors";
import { db } from "./firebase.js"; // Adjust path as needed
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";
import admin from "firebase-admin";
import { readFileSync, existsSync, readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Initialize Firebase Admin using env (service account can be optional with application default or via env creds)
if (!admin.apps.length) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Prefer explicit GOOGLE_APPLICATION_CREDENTIALS; fall back to first JSON in ./keys
    let credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credentialsPath || !existsSync(credentialsPath)) {
      const keysDir = path.join(__dirname, "keys");
      try {
        const jsonFiles = readdirSync(keysDir).filter((f) => f.toLowerCase().endsWith(".json"));
        if (jsonFiles.length > 0) {
          credentialsPath = path.join(keysDir, jsonFiles[0]);
        }
      } catch {}
    }

    // Normalize path (handle relative vs absolute and spaces in Windows paths)
    if (credentialsPath && !path.isAbsolute(credentialsPath)) {
      credentialsPath = path.resolve(__dirname, credentialsPath);
    }

    if (credentialsPath && existsSync(credentialsPath)) {
      const serviceAccount = JSON.parse(readFileSync(credentialsPath, "utf8"));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id
      });
      console.log("Firebase Admin initialized with service account credentials.");
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault()
      });
      console.log("Firebase Admin initialized with application default credentials.");
      if (credentialsPath && !existsSync(credentialsPath)) {
        console.warn(`Provided GOOGLE_APPLICATION_CREDENTIALS not found at: ${credentialsPath}`);
      }
      // Also log what JSON files we saw in ./keys for easier debugging
      try {
        const keysDir = path.join(__dirname, "keys");
        const seen = readdirSync(keysDir).filter((f) => f.toLowerCase().endsWith(".json"));
        console.log(`Discovered service account files in keys/: ${seen.join(", ") || "(none)"}`);
      } catch {}
    }
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
    const data = req.body;
    data.completed = false; // Ensure this field is set for new bookings!
    const docRef = await admin.firestore().collection('appointments').add(data);
    res.json({ success: true, id: docRef.id });
  } catch (e) {
    res.status(500).json({ error: "Failed to book appointment" });
  }
});

// Add this route to fetch appointments for a user by email
app.get('/api/appointments', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email required" });

  try {
    // Use the Admin SDK for Firestore
    const snapshot = await admin.firestore().collection('appointments').where('email', '==', email).get();
    const appointments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Compute whether each appointment is over based on date, startTime, and duration
    const now = new Date();
    const withComputed = appointments.map((a) => {
      const dateStr = a?.date; // expected YYYY-MM-DD
      const timeStr = a?.startTime; // expected HH:mm
      const durationMin = Number(a?.duration || 0) || 0;
      let start = null;
      try {
        if (dateStr && timeStr) {
          const [y, m, d] = String(dateStr).split('-').map((n) => Number(n));
          const [hh, mm] = String(timeStr).split(':').map((n) => Number(n));
          start = new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0, 0, 0);
        }
      } catch {}
      const end = start ? new Date(start.getTime() + durationMin * 60 * 1000) : start;
      const computedCompleted = end ? now >= end : Boolean(a?.completed);
      return { ...a, _startAt: start?.toISOString?.() || null, _endAt: end?.toISOString?.() || null, computedCompleted };
    });

    // Split and sort
    const previous = withComputed
      .filter((a) => a.computedCompleted)
      .sort((a, b) => (a._startAt || '').localeCompare(b._startAt || ''));
    const upcoming = withComputed
      .filter((a) => !a.computedCompleted)
      .sort((a, b) => (a._startAt || '').localeCompare(b._startAt || ''));

    res.json({ upcoming, previous });
  } catch (err) {
    console.error("Error fetching appointments:", err); // <--- check this output!
    res.status(500).json({ error: "Failed to fetch appointments" });
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

// Chat proxy using Gemini only
app.post("/api/chat", async (req, res) => {
  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
    const userText = String(req.body?.text || "").trim();
    const combined = messages.length ? messages : (userText ? [{ role: "user", content: userText }] : []);
    if (combined.length === 0) {
      return res.status(400).json({ error: "No input provided" });
    }

    const systemPreamble = "You are Serenity, a warm, supportive mental wellness companion.\n"
      + "Listen empathetically, validate feelings, avoid diagnoses, offer gentle coping tips (breathing, grounding, journaling), "
      + "and suggest professional help or emergency contacts if there is risk of harm. Keep replies concise (4-8 sentences).";

    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    if (!geminiApiKey) {
      return res.status(500).json({ error: "Gemini API key not configured" });
    }

    // Build Gemini-compatible content turns
    const contents = [];
    contents.push({ role: "user", parts: [{ text: systemPreamble }] });
    combined.forEach((m) => {
      contents.push({ role: m.role === "user" ? "user" : "model", parts: [{ text: String(m.content || "") }] });
    });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 320
        }
      })
    });

    if (!response.ok) {
      const errTxt = await response.text();
      return res.status(502).json({ error: "Gemini upstream error", detail: errTxt });
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here with you. Could you share a bit more?";
    return res.json({ reply });
  } catch (e) {
    console.error("Chat proxy error:", e);
    return res.status(500).json({ error: "Chat proxy failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});