import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000'

function useBooking() {
	const [status, setStatus] = useState('idle')
	const [message, setMessage] = useState('')
	const submit = async (payload) => {
		try {
			setStatus('loading')
			setMessage('')
			const res = await axios.post(`${API_BASE}/api/appointments/book`, payload)
			setStatus('success')
			const id = res?.data?.appointmentId
			setMessage(id ? `Booked! Confirmation ID: ${id}` : 'Request received. We will email confirmation.')
		} catch (e) {
			setStatus('error')
			setMessage(e?.response?.data?.message || 'Something went wrong. Try again.')
		}
	}
	return { status, message, submit }
}

function Navbar() {
	return (
		<header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-blue-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<Link to="/" className="flex items-center gap-2">
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">S</span>
						<span className="font-extrabold text-xl">Serenity</span>
					</Link>
					<nav className="hidden md:flex items-center gap-6 text-sm">
						<Link to="/resources" className="hover:text-blue-600">Resources</Link>
						<Link to="/community" className="hover:text-blue-600">Community</Link>
						<Link to="/appointments" className="hover:text-blue-600">Appointments</Link>
					</nav>
					<div className="flex items-center gap-3">
						<Link to="/appointments" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">Book Session</Link>
					</div>
				</div>
			</div>
		</header>
	)
}

function LandingHero() {
	const navigate = useNavigate()
	return (
		<section className="relative overflow-hidden">
			<div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-200 blur-3xl opacity-60" />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
				<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
					<h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">Smart mental wellness for every student</h1>
					<p className="mt-4 text-lg text-gray-600">AI-guided support, confidential booking, culturally inclusive resources, and peer communities—together in one platform.</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<button onClick={() => navigate('/appointments')} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">Book Session</button>
						<button onClick={() => navigate('/resources')} className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-black focus:ring-4 focus:ring-gray-300">Explore Resources</button>
					</div>
					<div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
						<span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600"></span>Anonymous & secure</span>
						<span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600"></span>Culturally relevant</span>
						<span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-blue-600"></span>Campus-ready</span>
					</div>
				</motion.div>
				<motion.div className="glass rounded-2xl p-6 border border-blue-100 shadow-sm" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}>
					<div className="grid grid-cols-2 gap-4 text-sm">
						{[
							{ t: 'AI First-Aid', d: 'Chatbot offers coping tips, crisis steps, and referrals.' },
							{ t: 'Confidential Booking', d: 'Schedule with campus counsellors in minutes.' },
							{ t: 'Resource Hub', d: 'Videos & audio in regional languages.' },
							{ t: 'Peer Support', d: 'Safe, moderated discussion spaces.' }
						].map((card, idx) => (
							<motion.div key={idx} className="rounded-xl bg-white p-4 border" initial={{ y: 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.4, delay: idx * 0.08 }} viewport={{ once: true }}>
								<p className="font-semibold">{card.t}</p>
								<p className="text-gray-600">{card.d}</p>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}

function LandingFeatures() {
	const items = [
		{ tag: 'AI', t: 'AI-Guided First-Aid', d: 'Interactive bot with CBT-inspired prompts, grounding, and referrals.' },
		{ tag: 'BK', t: 'Confidential Booking', d: 'Book campus counsellors or helplines with privacy-first workflows.' },
		{ tag: 'PS', t: 'Peer Support', d: 'Moderated forums to share experiences and uplift each other safely.' }
	]
	return (
		<section id="features" className="py-16 sm:py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-bold">What Serenity offers</h2>
				<p className="mt-2 text-gray-600">Early detection, personalized help, and community care—accessible and stigma-free.</p>
				<div className="mt-10 grid md:grid-cols-3 gap-6">
					{items.map((it, idx) => (
						<motion.div key={it.t} className="rounded-2xl border p-6" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ duration: 0.45, delay: idx * 0.06 }} viewport={{ once: true }}>
							<div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">{it.tag}</div>
							<h3 className="mt-4 font-semibold">{it.t}</h3>
							<p className="text-gray-600">{it.d}</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}

function ResourcesPage() {
	const cards = [
		{ img: 'https://images.unsplash.com/photo-1556139930-c23fa4a4b2c1?q=80&w=1200&auto=format&fit=crop', t: '4-7-8 Breathing', d: 'Audio guide to calm anxiety in 2 minutes.' },
		{ img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop', t: 'Beat Study Burnout', d: 'Video tips for balance and focus.' },
		{ img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop', t: 'Sleep Hygiene', d: 'Checklist for restorative sleep.' }
	]
	return (
		<main className="py-12 bg-gray-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold">Resources</h1>
				<p className="text-gray-600 mt-2">Videos, audio guides, and materials in multiple languages.</p>
				<div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{cards.map((c) => (
						<motion.article key={c.t} className="rounded-xl overflow-hidden border bg-white" whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
							<img src={c.img} alt="" className="h-40 w-full object-cover" />
							<div className="p-4">
								<h3 className="font-semibold">{c.t}</h3>
								<p className="text-gray-600 text-sm">{c.d}</p>
							</div>
						</motion.article>
					))}
				</div>
			</div>
		</main>
	)
}

function CommunityPage() {
	const [articles, setArticles] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [openForm, setOpenForm] = useState(false)
	const titleRef = useRef(null)
	const contentRef = useRef(null)
	const authorRef = useRef(null)

	const fetchArticles = async () => {
		try {
			setLoading(true)
			setError('')
			const res = await axios.get(`${API_BASE}/api/community/articles`)
			setArticles(res?.data?.articles || [])
		} catch (e) {
			setError('Failed to load articles')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchArticles()
	}, [])

	const submitArticle = async (e) => {
		e.preventDefault()
		const title = titleRef.current.value.trim()
		const content = contentRef.current.value.trim()
		const author = authorRef.current.value.trim()
		if (!title || !content) return
		try {
			await axios.post(`${API_BASE}/api/community/articles`, { title, content, author })
			titleRef.current.value = ''
			contentRef.current.value = ''
			authorRef.current.value = ''
			setOpenForm(false)
			fetchArticles()
		} catch (e) {
			alert('Failed to post article')
		}
	}

	return (
		<main className="py-12 bg-gray-50 min-h-screen">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">Community</h1>
						<p className="text-gray-600 mt-2">Share your experiences and support others. Posts are public.</p>
					</div>
					<button onClick={() => setOpenForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">New Article</button>
				</div>

				<section className="mt-8">
					<div className="bg-white rounded-2xl border">
						<div className="p-4 border-b flex items-center justify-between"><h2 className="font-semibold">Recent articles</h2><button onClick={fetchArticles} className="text-blue-700 text-sm hover:underline">Refresh</button></div>
						<div className="divide-y">
							{loading ? (
								<div className="p-6 text-gray-500">Loading…</div>
							) : articles.length === 0 ? (
								<div className="p-6 text-gray-500">No articles yet. Be the first to share.</div>
							) : (
								articles.map((a) => (
									<div key={a.id} className="p-6">
										<h3 className="font-semibold text-lg">{a.title}</h3>
										<p className="text-sm text-gray-500">By {a.author || 'Anonymous'} • {a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000).toLocaleString() : ''}</p>
										<p className="mt-3 whitespace-pre-line text-gray-700">{a.content}</p>
									</div>
								))
							)}
						</div>
					</div>
				</section>
			</div>

			{openForm && (
				<div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
					<div className="absolute inset-0 bg-black/50" onClick={() => setOpenForm(false)} />
					<motion.div className="w-full sm:w-[720px] rounded-t-2xl sm:rounded-2xl bg-white p-6 sm:p-8 shadow-xl relative" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
						<div className="flex items-center justify-between">
							<h3 className="text-xl font-semibold">Publish new article</h3>
							<button className="text-gray-500 hover:text-gray-700" onClick={() => setOpenForm(false)} aria-label="Close">✕</button>
						</div>
						<form onSubmit={submitArticle} className="mt-4 grid grid-cols-1 gap-4">
							<div className="grid sm:grid-cols-2 gap-4">
								<label className="block text-sm font-medium">Title<input ref={titleRef} maxLength={160} required className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
								<label className="block text-sm font-medium">Author (optional)<input ref={authorRef} maxLength={80} placeholder="Anonymous" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
							</div>
							<label className="block text-sm font-medium">Content<textarea ref={contentRef} maxLength={8000} required rows={6} className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
							<div className="flex items-center gap-3">
								<button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300">Publish</button>
								{error && <span className="text-sm text-red-600">{error}</span>}
							</div>
						</form>
					</motion.div>
				</div>
			)}
		</main>
	)
}

function AppointmentsPage() {
	const { status, message, submit } = useBooking()
	const onSubmit = (e) => {
		e.preventDefault()
		const form = new FormData(e.currentTarget)
		const payload = Object.fromEntries(form.entries())
		submit(payload)
	}
	return (
		<main className="py-12 bg-gray-50 min-h-screen">
			<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold">Book an Appointment</h1>
				<p className="text-gray-600 mt-2">Choose a counsellor, date and time. We’ll send a confirmation.</p>
				<form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4 bg-white rounded-2xl border p-6">
					<label className="block text-sm font-medium">Full name<input name="fullName" required className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
					<label className="block text-sm font-medium">Email<input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<label className="block text-sm font-medium">Counsellor<select name="counsellor" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"><option value="any">Any available</option><option value="c1">Dr. Sharma</option><option value="c2">Ms. Iyer</option></select></label>
						<label className="block text-sm font-medium">Mode<select name="mode" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"><option>In-Person</option><option>Phone</option><option>Video</option></select></label>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<label className="block text-sm font-medium">Date<input name="date" type="date" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
						<label className="block text-sm font-medium">Start time<input name="startTime" type="time" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500" /></label>
						<label className="block text-sm font-medium">Duration<select name="duration" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"><option value="30">30 min</option><option value="45">45 min</option><option value="60">60 min</option></select></label>
					</div>
					<label className="block text-sm font-medium">Primary concern<select name="concern" className="mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500"><option>Anxiety</option><option>Depression</option><option>Burnout</option><option>Academic Stress</option><option>Sleep</option></select></label>
					<div className="flex items-center gap-3">
						<button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300" disabled={status === 'loading'}>
							{status === 'loading' ? 'Submitting...' : 'Submit'}
						</button>
						<p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>{message}</p>
					</div>
				</form>
			</div>
		</main>
	)
}

function AnalyticsPreview() {
	const labels = useMemo(() => {
		const now = new Date()
		return Array.from({ length: 6 }).map((_, i) => {
			const d = new Date(now)
			d.setMonth(now.getMonth() - (5 - i))
			return d.toLocaleString(undefined, { month: 'short' })
		})
	}, [])
	const data = useMemo(() => ({
		labels,
		datasets: [
			{ label: 'Anxiety mentions', data: [32, 36, 31, 28, 40, 37], borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.15)', tension: 0.35, fill: true },
			{ label: 'Sleep issues', data: [18, 22, 21, 25, 23, 26], borderColor: '#64748b', backgroundColor: 'rgba(100,116,139,0.15)', tension: 0.35, fill: true }
		]
	}), [labels])
	const options = useMemo(() => ({ responsive: true, plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 10 } } } }), [])
	return (
		<section className="py-16 sm:py-24 bg-blue-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-end justify-between">
					<div>
						<h2 className="text-3xl font-bold">Anonymous trends for admins</h2>
						<p className="mt-2 text-gray-600">Track campus-wide wellness trends to plan interventions.</p>
					</div>
					<Link to="/appointments" className="text-blue-700 hover:underline text-sm">Get started</Link>
				</div>
				<div className="mt-8 rounded-2xl border bg-white p-6">
					<Line data={data} options={options} height={120} />
				</div>
			</div>
		</section>
	)
}

function Footer() {
	return (
		<footer className="border-t">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-sm text-gray-500">© {new Date().getFullYear()} Serenity</p>
				<div className="flex items-center gap-4 text-sm">
					<a href="#" className="hover:text-blue-600">Privacy</a>
					<a href="#" className="hover:text-blue-600">Terms</a>
					<a href="#" className="hover:text-blue-600">Contact</a>
				</div>
			</div>
		</footer>
	)
}

function LandingPage() {
	return (
		<>
			<LandingHero />
			<LandingFeatures />
			<AnalyticsPreview />
		</>
	)
}

export default function App() {
	return (
		<div className="bg-gradient-to-b from-blue-50 to-white text-gray-800 min-h-screen">
			<BrowserRouter>
				<Navbar />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/appointments" element={<AppointmentsPage />} />
					<Route path="/resources" element={<ResourcesPage />} />
					<Route path="/community" element={<CommunityPage />} />
				</Routes>
				<Footer />
			</BrowserRouter>
		</div>
	)
} 