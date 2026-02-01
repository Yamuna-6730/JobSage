"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Bot, X, Maximize2 } from "lucide-react";
import { sendQuery, Job } from "@/lib/api";
import JobCard from "./JobCard";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";

interface Message {
    role: "user" | "assistant";
    content: string;
    jobs?: Job[];
}

export default function ChatInterface({
    onActivate,
}: {
    onActivate?: () => void;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const isChatPage = pathname === "/chat";
    const jobsRef = useRef<HTMLDivElement>(null);


    const [query, setQuery] = useState("");
    const [mode, setMode] = useState<"remote" | "pro">("remote");

    const [messages, setMessages] = useState<Message[]>([
        {
            role: "assistant",
            content:
                "Hello! I'm JobSage. Ask me to find internships, jobs, or explain concepts.",
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [hasUserInteracted, setHasUserInteracted] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const dummyJobs = [
        {
            title: "Frontend Developer Intern",
            company: "TechNova Solutions",
            location: "Hyderabad, India",
            salary_or_stipend: "₹20,000 / month",
            source: "LinkedIn",
            link: "#",
            match_score: 87,
            match_reasoning:
            "Matches your React and Tailwind experience.",
        },
        {
            title: "Remote React Intern",
            company: "PixelCraft",
            location: "Remote",
            salary_or_stipend: "₹25,000 / month",
            source: "Indeed",
            link: "#",
            match_score: 82,
            match_reasoning:
            "Remote-friendly role with strong frontend focus.",
        },
        {
            title: "Junior Frontend Engineer",
            company: "CodeNest",
            location: "Bangalore, India",
            salary_or_stipend: "₹6 LPA",
            source: "Company Site",
            link: "#",
            match_score: 79,
            match_reasoning:
            "Good match for early-career frontend developers.",
        },
        {
            title: "UI Engineer Intern",
            company: "Designify",
            location: "Remote",
            salary_or_stipend: "₹18,000 / month",
            source: "LinkedIn",
            link: "#",
            match_score: 75,
            match_reasoning:
            "UI-heavy role with design-system exposure.",
        },
        {
            title: "Frontend Developer",
            company: "StartupX",
            location: "Pune, India",
            salary_or_stipend: "₹8 LPA",
            source: "AngelList",
            link: "#",
            match_score: 73,
            match_reasoning:
            "Fast-paced startup role, React focused.",
        },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        if (!hasUserInteracted) {
            setHasUserInteracted(true);
            onActivate?.();
        }

        const userMsg: Message = { role: "user", content: query };
        setMessages((prev) => [...prev, userMsg]);
        setQuery("");
        setLoading(true);

        try {
            const data = await sendQuery(userMsg.content);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: data.response },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, I encountered an error connecting to the agent.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div
            className={`flex flex-col bg-white border border-black shadow-[0_5px_0_#191A23]
            ${
                isChatPage
                    ? "h-[calc(100svh-4rem)] rounded-[48px] m-4"
                    : "h-150 rounded-[45px]"
            }`}
        >
            {/* Header */}
            <div className="bg-[#B9FF66] p-4 border-b border-black flex items-center justify-between rounded-t-[45px]">
                <div className="flex items-center gap-3">
                    <div className="bg-black text-[#B9FF66] p-2 rounded-full">
                        <Bot size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-black">
                            JobSage Assistant
                        </h3>
                        <p className="text-xs font-semibold text-black opacity-80">
                            Online • AI Agent
                        </p>
                    </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-10">

                {/* Expand button – ONLY on home */}
                {!isChatPage && (
                    <button
                    onClick={() => router.push("/chat")}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black bg-black text-[#B9FF66]
                    transition-all duration-200 ease-out
                    hover:scale-110 hover:shadow-md
                    active:scale-95"
                    aria-label="Expand chat"
                    >
                    <Maximize2 size={16} />
                    </button>
                )}

                {/* Mode Toggle – ONLY on /chat */}
                {isChatPage && (
                    <div className="relative flex bg-white border border-black rounded-full p-1">
                    
                    {/* Sliding pill */}
                    <span
                        className={`absolute top-1 bottom-1 w-20 rounded-full bg-black transition-transform duration-300 ease-out
                        ${mode === "remote" ? "translate-x-0" : "translate-x-20"}`}
                    />

                    <button
                        onClick={() => setMode("remote")}
                        className={`relative z-10 w-20 px-3 py-1 text-sm font-semibold rounded-full
                        ${mode === "remote" ? "text-[#B9FF66]" : "text-black opacity-60"}`}
                    >
                        Remote
                    </button>

                    <button
                        onClick={() => setMode("pro")}
                        className={`relative z-10 w-20 px-3 py-1 text-sm font-semibold rounded-full
                        ${mode === "pro" ? "text-[#B9FF66]" : "text-black opacity-60"}`}
                    >
                        Pro
                    </button>
                    </div>
                )}

                {/* Close – ONLY on /chat */}
                {isChatPage && (
                    <button
                    onClick={() => router.back()}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-black bg-black text-[#B9FF66] transition-all duration-200 ease-out
                    hover:scale-110 hover:shadow-md
                    active:scale-95"
                    aria-label="Close chat"
                    >
                    <X size={16} />
                    </button>
                )}
                </div>

            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F3F3F3] scroll-smooth overscroll-contain">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                            msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                        }`}
                    >
                        <div
                            className={`max-w-[85%] p-4 text-base font-medium border border-black shadow-[2px_2px_0_#000]
                            ${
                                msg.role === "user"
                                    ? "bg-[#B9FF66] text-black rounded-l-3xl rounded-br-md"
                                    : "bg-white text-black rounded-r-3xl rounded-bl-md"
                            }`}
                        >
                            {msg.content}
                        </div>
                    </motion.div>
                ))}

                {/* JobCard*/}
                {hasUserInteracted && (
                <div className="mt-6 flex items-center gap-3">

                    {/* Left Arrow */}
                    <button
                    onClick={() =>
                        jobsRef.current?.scrollBy({ left: -450, behavior: "smooth" })
                    }
                    className="w-9 h-9 rounded-full bg-black text-[#B9FF66]
                        flex items-center justify-center shadow-md
                        hover:scale-110 transition"
                    >
                    ‹
                    </button>

                    {/* Job Cards */}
                    <div
                    ref={jobsRef}
                    className="flex gap-6 overflow-x-auto scroll-smooth no-scrollbar"
                    >
                    {dummyJobs.map((job, index) => (
                        <div key={index} className="w-[420px] flex-shrink-0">
                        <JobCard job={job} />
                        </div>
                    ))}
                    </div>

                    {/* Right Arrow */}
                    <button
                    onClick={() =>
                        jobsRef.current?.scrollBy({ left: 450, behavior: "smooth" })
                    }
                    className="w-9 h-9 rounded-full bg-black text-[#B9FF66]
                        flex items-center justify-center shadow-md
                        hover:scale-110 transition"
                    >
                    ›
                    </button>
                </div>
                )}


                {loading && (
                    <div className="flex items-center gap-2 text-black text-sm">
                        <Loader2 className="animate-spin" size={16} />
                        Thinking & Searching...
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-black rounded-b-[45px] sticky bottom-0 z-10">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type your query here..."
                        className="w-full bg-gray-100 border border-black rounded-xl py-4 pl-4 pr-14 text-black"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-[#B9FF66] p-2 rounded-lg"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
