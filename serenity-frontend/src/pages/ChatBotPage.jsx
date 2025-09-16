import React, { useEffect, useRef, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export default function ChatbotPage() {
	const [messages, setMessages] = useState([
		{ role: "assistant", content: "Hi, I’m here to listen. What’s on your mind today?" }
	]);
	const [input, setInput] = useState("");
	const [sending, setSending] = useState(false);
	const viewRef = useRef(null);

	useEffect(() => {
		viewRef.current?.scrollTo({ top: viewRef.current.scrollHeight, behavior: "smooth" });
	}, [messages]);

	const send = async () => {
		const text = input.trim();
		if (!text || sending) return;
		setInput("");
		const next = [...messages, { role: "user", content: text }];
		setMessages(next);
		setSending(true);
		try {
			const res = await fetch(`${API_BASE}/api/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ messages: next.slice(-10) })
			});
			const data = await res.json();
			const reply = data?.reply?.trim() || "I'm here with you.";
			setMessages((m) => [...m, { role: "assistant", content: reply }]);
		} catch (e) {
			setMessages((m) => [...m, { role: "assistant", content: "Sorry, I had trouble replying. Could you try again?" }]);
		} finally {
			setSending(false);
		}
	};

	const onKey = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			send();
		}
	};

	return (
		<main className="py-12 bg-gray-50 min-h-screen">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold mb-2">Personal Listener</h1>
				<p className="text-gray-600 mb-4">A gentle, private space to share. If you’re in danger or considering self-harm, please contact local emergency services or a trusted person immediately.</p>
				<div ref={viewRef} className="h-[60vh] bg-white border rounded-xl p-4 overflow-y-auto">
					{messages.map((m, i) => (
						<div key={i} className={`mb-3 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
							<div className={`${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"} max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap`}>
								{m.content}
							</div>
						</div>
					))}
					{sending && (
						<div className="text-sm text-gray-500">Serenity is typing…</div>
					)}
				</div>
				<div className="mt-4 flex items-end gap-3">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						onKeyDown={onKey}
						rows={2}
						placeholder="Type how you feel…"
						className="flex-1 rounded-xl border px-3 py-2 bg-white"
					/>
					<button
						onClick={send}
						disabled={sending || !input.trim()}
						className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-50"
					>
						Send
					</button>
				</div>
				<p className="mt-3 text-xs text-gray-500">AI may be imperfect. For emergencies, call local services.</p>
			</div>
		</main>
	);
}


