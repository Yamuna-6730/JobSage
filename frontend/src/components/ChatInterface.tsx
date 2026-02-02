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
    const [jobResults, setJobResults] = useState<Job[]>([]);

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

    const dummyJobs: Job[] = [
        {
            job_title: "AI/ML Intern (LLMs & Agent Systems)",
            company: "Big AIR Lab",
            location: "Bangalore, India",
            work_mode: "Onsite",
            experience_required: "Entry level",
            skills_required: [
                "Machine Learning",
                "Deep Learning",
                "LLM fundamentals",
                "Python",
                "PyTorch",
                "NumPy",
                "Pandas",
                "Git/GitHub",
                "Hugging Face Transformers",
                "RAG systems",
                "LangChain",
                "LangGraph",
                "Docker",
                "PostgreSQL",
                "MongoDB"
            ],
            education: "Bachelor's in Computer Science or related field",
            salary_or_stipend: "₹100,000.00/yr - ₹150,000.00/yr",
            summary: "Big AIR Lab is seeking an AI/ML Intern for a 6-month on-site position in Bangalore, India. The intern will work on projects involving LLMs, retrieval systems, and agentic reasoning, contributing to experiments, data preparation, model evaluation, and prototype development within an AI/ML research-driven team focused on building intelligent AI Agents and RAG-based systems.",
            responsibilities: [
                "Assist in building and evaluating LLM- and agent-based pipelines (RAG, reasoning, tool use, etc.).",
                "Conduct small-scale experiments and contribute to prompt design and prompt evaluation.",
                "Help integrate LLMs with APIs, databases, and internal tools.",
                "Explore and document recent AI agent frameworks and LLM techniques.",
                "Collaborate with backend engineers to test and deploy prototypes."
            ],
            requirements: [
                "Strong foundations in Machine Learning and Deep Learning concepts.",
                "Good understanding of LLM fundamentals - tokenization, embeddings, attention, context, etc.",
                "Some exposure to Prompt Engineering and reasoning patterns like Chain of Thought or ReAct.",
                "Experience in Python and libraries like PyTorch, NumPy, Pandas.",
                "Familiarity with Git/GitHub for version control.",
                "Curiosity and ability to learn quickly in a research-focused environment."
            ],
            job_description: "IAI Solution Pvt Ltd operates at the edge of applied AI where foundational research meets real-world deployment. We craft intelligent systems that think in teams, adapt with context, and deliver actionable insight across domains. We're currently seeking passionate and skilled AI/ML Interns who are eager to contribute to real-world AI development, have hands-on experience with model fine-tuning, and are adept in prompt engineering. If you're ready to work on impactful projects and expand your expertise in AI, we'd love to hear from you.\n\nPosition Summary: We're an AI/ML research-driven team focused on building intelligent AI Agents and RAG-based systems for real-world applications in finance, business, and personal assistance. Our work combines applied research and fast-paced product development to create powerful, modular AI systems that think, reason, and act. As an AI/ML Intern, you'll work closely with our core AI/ML team on projects involving LLMs, retrieval systems, and agentic reasoning.",
            source_url: "https://www.linkedin.com/jobs/view/4349464576/"
        },
        {
            job_title: "Full Stack Software Developer (.Net)",
            company: "NASDAQ",
            location: "Bengaluru, Karnataka",
            work_mode: "Hybrid",
            experience_required: "3-5 years of software development experience",
            skills_required: [
                "C#.Net",
                "ASP.Net",
                "MSSQL",
                "Postgres",
                "JavaScript",
                "Vue",
                "Angular",
                "React",
                "Microservices architecture",
                "Git",
                "NUnit testing",
                "HTML5",
                "CSS3",
                "AWS"
            ],
            education: "Bachelor/Master in Computer Science",
            salary_or_stipend: "₹8-12 LPA",
            summary: "Nasdaq Technology is looking for a passionate .Net Developer to join their Bangalore technology center. This role involves building, developing, and implementing rich internet application software for Nasdaq Analytics products, playing a key role in delivering complex technical systems within the FinTech industry. As a Senior Software Developer, you will be responsible for driving the implementation of central initiatives across the Nasdaq Analytics.",
            responsibilities: [
                "Build, develop, fix and implement rich internet application software for Nasdaq Analytics product.",
                "Participate in technical develop reviews, functional specification reviews, develop project estimates, schedules, test plans, and code reviews.",
                "Proactively identify and resolve potential problems/issues including authoring of technical specifications.",
                "Conduct performance testing, review results, identify bottlenecks, and profile code"
            ],
            requirements: [
                "At least 3-5 years of software development experience",
                "Expertise in writing server side code using C#.Net, ASP.Net",
                "Expertise understanding of MSSQL/Postgres database, database concepts and should be able to write complicated database queries",
                "Should have worked on writing client-side code using JavaScript, ideally including experience with Vue, Angular or React.",
                "Understanding of Microservices architecture, Parallel programming is a plus",
                "Knack of adhering to the best develop practices",
                "Proficient understanding of code versioning tools like Git",
                "Experience in NUnit testing"
            ],
            job_description: "Nasdaq is continuously revolutionizing markets and undergoing transformations while we adopt new technologies to develop innovative solutions, constantly aiming to rewrite tomorrow. As a Senior Software Developer, you will play a key role in the delivery of complex technical systems of varying sizes to new and existing customers and will be part of discovering new technologies within the FinTech industry.\n\nYou will work with a group of enthusiastic and experienced team members, collaborating with cross functional teams, including designers, product managers and other specialists. Besides working closely with your colleagues in Bangalore, you will also work closely with Nasdaq teams in other countries.\n\nNasdaq is a vibrant and entrepreneurial company where everyone is encouraged to take initiative, challenge status quo, and take intelligent risks. We want everyone to feel welcome and bring their authentic self to work.",
            source_url: "https://in.indeed.com/viewjob?jk=1bcada9602f35c43"
        },
        {
            job_title: "Frontend Developer Intern",
            company: "TechNova Solutions",
            location: "Hyderabad, India",
            salary_or_stipend: "₹20,000 / month",
            source_url: "https://www.linkedin.com/jobs/view/sample1",
            work_mode: "Hybrid",
            experience_required: "0-1 years",
            skills_required: ["React", "JavaScript", "TypeScript", "Tailwind CSS", "Git"],
            education: "Bachelor's in Computer Science (pursuing or completed)",
            summary: "Exciting opportunity for a frontend developer to work with modern React technologies and build user-centric applications in a collaborative team environment.",
            responsibilities: [
                "Develop and maintain responsive web applications using React",
                "Collaborate with design team to implement UI/UX designs",
                "Write clean, maintainable code following best practices",
                "Participate in code reviews and team meetings"
            ],
            requirements: [
                "Strong knowledge of React and JavaScript",
                "Understanding of responsive design principles",
                "Familiarity with version control (Git)",
                "Good communication skills"
            ],
            job_description: "Join our dynamic team as a Frontend Developer Intern and gain hands-on experience building modern web applications. You'll work alongside experienced developers on real-world projects while learning industry best practices."
        }
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
                { role: "assistant", content: data.response || data.final_answer || "Here are the results." },
            ]);
            
            // Update job results if backend returns jobs
            if (data.structured_data?.jobs && data.structured_data.jobs.length > 0) {
                setJobResults(data.structured_data.jobs);
            }
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
                <div className="mt-6 flex items-center gap-3 w-full max-w-[1400px] mx-auto">

                    {/* Left Arrow */}
                    <button
                    onClick={() => {
                        const container = jobsRef.current;
                        if (container) {
                            // Scroll by 3 cards worth: 3 * (400px card width + 20px gap) = 1260px
                            container.scrollBy({ left: -1260, behavior: "smooth" });
                        }
                    }}
                    className="w-10 h-10 rounded-full bg-black text-[#B9FF66]
                        flex items-center justify-center shadow-md flex-shrink-0
                        hover:scale-110 transition border-2 border-black"
                    >
                    ‹
                    </button>

                    {/* Job Cards Container */}
                    <div className="flex-1 overflow-hidden">
                        <div
                        ref={jobsRef}
                        className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar"
                        >
                        {/* Display backend jobs if available, otherwise show dummy jobs */}
                        {(jobResults.length > 0 ? jobResults : dummyJobs).map((job, index) => (
                            <div key={index} className="w-[400px] flex-shrink-0">
                            <JobCard job={job} />
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Right Arrow */}
                    <button
                    onClick={() => {
                        const container = jobsRef.current;
                        if (container) {
                            // Scroll by 3 cards worth: 3 * (400px card width + 20px gap) = 1260px
                            container.scrollBy({ left: 1260, behavior: "smooth" });
                        }
                    }}
                    className="w-10 h-10 rounded-full bg-black text-[#B9FF66]
                        flex items-center justify-center shadow-md flex-shrink-0
                        hover:scale-110 transition border-2 border-black"
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
