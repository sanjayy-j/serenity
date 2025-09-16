import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function AppointmentsPage() {
  const [user, loading] = useAuthState(auth);
  const [upcoming, setUpcoming] = useState([]);
  const [previous, setPrevious] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // NEW
  const [refresh, setRefresh] = useState(0); // NEW
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFetching(true);
      fetch(`${API_BASE}/api/appointments?email=${encodeURIComponent(user.email)}`)
        .then((res) => res.json())
        .then((data) => {
          const u = Array.isArray(data?.upcoming) ? data.upcoming : [];
          const p = Array.isArray(data?.previous) ? data.previous : [];
          setUpcoming(u);
          setPrevious(p);
        })
        .catch(() => setError("Failed to load appointments"))
        .finally(() => setFetching(false));
    }
  }, [user, refresh]); // use refresh as dependency

  if (loading) return <div className="p-8 text-center">Loading…</div>;

  if (!user)
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Please sign in with Google to view and book appointments.</p>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/login")}
        >
          Sign in with Google
        </button>
      </div>
    );

  // upcoming/previous come from backend already computed/sorted

  return (
    <main className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">Your Appointments</h1>
        <p className="text-gray-600 mb-6">
          View your upcoming and previous appointments. Book a new session below.
        </p>
        {successMsg && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMsg}</div>
        )}
        {fetching ? (
          <div className="mb-6">Loading appointments…</div>
        ) : error ? (
          <div className="mb-6 text-red-600">{error}</div>
        ) : (
          <>
            <section className="mb-6">
              <h2 className="font-semibold mb-2">Upcoming</h2>
              {upcoming.length === 0 ? (
                <p className="text-gray-500">No upcoming appointments.</p>
              ) : (
                <ul className="space-y-2">
                  {upcoming.map((a) => (
                    <li key={a.id || a._id} className="bg-white rounded p-3 border">
                      <span className="font-medium">{a.date} {a.startTime}</span> — {a.concern}
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="mb-6">
              <h2 className="font-semibold mb-2">Previous</h2>
              {previous.length === 0 ? (
                <p className="text-gray-500">No previous appointments.</p>
              ) : (
                <ul className="space-y-2">
                  {previous.map((a) => (
                    <li key={a.id || a._id} className="bg-white rounded p-3 border">
                      <span className="font-medium">{a.date} {a.startTime}</span> — {a.concern}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
          onClick={() => setShowBooking(true)}
        >
          Book Appointment
        </button>
        {showBooking && (
          <BookingForm
            user={user}
            onClose={() => setShowBooking(false)}
            onBooked={(msg) => {
              setShowBooking(false);
              setSuccessMsg(msg || "Appointment booked! Confirmation will be emailed.");
              setRefresh((r) => r + 1);
              setTimeout(() => setSuccessMsg(""), 4000);
            }}
          />
        )}
      </div>
    </main>
  );
}

function BookingForm({ user, onClose, onBooked }) {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    fullName: user.displayName || "",
    email: user.email,
    counsellor: "any",
    mode: "In-Person",
    date: "",
    startTime: "",
    duration: "30",
    concern: "Anxiety",
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/api/appointments/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Booking failed");
      setStatus("success");
      setMessage("Appointment booked! Confirmation will be emailed.");
      onBooked("Appointment booked! Confirmation will be emailed.");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border p-6 mt-4 space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium">
          Full name
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Email
          <input
            name="email"
            value={form.email}
            disabled
            className="mt-1 w-full rounded-lg border px-3 py-2 bg-gray-100"
          />
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block text-sm font-medium">
          Counsellor
          <select
            name="counsellor"
            value={form.counsellor}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option value="any">Any available</option>
            <option value="c1">Dr. Sharma</option>
            <option value="c2">Ms. Iyer</option>
          </select>
        </label>
        <label className="block text-sm font-medium">
          Mode
          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option>In-Person</option>
            <option>Phone</option>
            <option>Video</option>
          </select>
        </label>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <label className="block text-sm font-medium">
          Date
          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Start time
          <input
            name="startTime"
            type="time"
            value={form.startTime}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border px-3 py-2"
          />
        </label>
        <label className="block text-sm font-medium">
          Duration
          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border px-3 py-2"
          >
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
          </select>
        </label>
      </div>
      <label className="block text-sm font-medium">
        Primary concern
        <select
          name="concern"
          value={form.concern}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border px-3 py-2"
        >
          <option>Anxiety</option>
          <option>Depression</option>
          <option>Burnout</option>
          <option>Academic Stress</option>
          <option>Sleep</option>
        </select>
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2.5 rounded"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Booking..." : "Book"}
        </button>
        <button type="button" onClick={onClose} className="ml-2">
          Cancel
        </button>
        {message && (
          <span
            className={`ml-4 text-sm ${
              status === "error" ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </span>
        )}
      </div>
    </form>
  );
}