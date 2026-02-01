export const API_URL = "http://localhost:8000";

export interface Job {
    title: string;
    company: string;
    location: string;
    link: string;
    source: string;
    work_mode?: string; // Remote, Hybrid, Onsite
    match_score?: number;
    match_reasoning?: string;
    salary_or_stipend?: string;
}

export interface ChatResponse {
    response: string;
    structured_jobs: Job[];
}

export async function sendQuery(query: string): Promise<ChatResponse> {
    const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!res.ok) {
        throw new Error('Failed to fetch response');
    }

    return res.json();
}
