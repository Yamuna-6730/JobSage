export const API_URL = "http://localhost:8000";

export interface Job {
    job_title: string;
    company: string;
    location: string;
    source_url: string;
    work_mode?: string;
    salary_or_stipend?: string;
    experience_required?: string;
    skills_required?: string[];
    education?: string;
    eligibility?: string;
    summary?: string;
    job_description?: string;
    responsibilities?: string[];
    requirements?: string[];
}

export interface ChatResponse {
    response: string;
    structured_data?: {
        jobs: Job[];
    };
    final_answer?: string;
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
