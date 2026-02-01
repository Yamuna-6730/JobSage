import os
from typing import Dict, Any, List
from langchain_google_genai import ChatGoogleGenerativeAI
from firecrawl import FirecrawlApp
from pydantic import BaseModel, Field
from agent.state import AppState
from agent.schema import Job, JobStructured, JobRecommendation
from dotenv import load_dotenv

load_dotenv()

def get_llm():
    if os.getenv("GOOGLE_API_KEY"):
        return ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", temperature=0)
    return None

def get_firecrawl():
    if os.getenv("FIRECRAWL_API_KEY"):
        return FirecrawlApp(api_key=os.getenv("FIRECRAWL_API_KEY"))
    return None

# Initialize helpers
llm = get_llm()
firecrawl = get_firecrawl()

def router_node(state: AppState) -> Dict[str, Any]:
    """Decides if the query is job-related using LLM."""
    query = state["query"]
    
    class RouterOutput(BaseModel):
        is_job_query: bool = Field(description="True if the user is asking for jobs, internships, or career opportunities.")
    
    try:
        if os.getenv("GOOGLE_API_KEY"):
            router = llm.with_structured_output(RouterOutput)
            result = router.invoke(f"Is this query asking for jobs or career opportunities? Query: {query}")
            return {"is_job_query": result.is_job_query}
    except Exception as e:
        print(f"Router Error: {e}")
    
    # Fallback keyword search
    is_job = any(k in query.lower() for k in ["job", "internship", "hiring", "vacancy", "work", "career", "opportunity"])
    return {"is_job_query": is_job}

def search_jobs_node(state: AppState) -> Dict[str, Any]:
    """Searches for job URLs from various sources."""
    print(f"Searching for jobs with query: {state['query']}")
    
    # In a real scenario, this would call LinkedIn MCP or Google Search API
    # specific to the query location and keywords.
    # For this demo, we mock relevant URLs or use a Search Tool if available.
    
    # Mocking results based on query to demonstrate flow
    mock_jobs = [
        "https://www.linkedin.com/jobs/view/data-scientist-intern-at-google", # Mock
        "https://in.indeed.com/viewjob?jk=123456789", # Mock
        "https://wellfound.com/jobs/99999-software-engineer" # Mock
    ]
    
    # Ideally use a search tool here
    return {"job_urls": mock_jobs}

def scrape_jobs_node(state: AppState) -> Dict[str, Any]:
    """Scrapes job descriptions from URLs using Firecrawl."""
    urls = state["job_urls"]
    raw_jobs = []
    
    if firecrawl and os.getenv("FIRECRAWL_API_KEY"):
        print(f"Scraping {len(urls)} jobs with Firecrawl...")
        for url in urls[:3]: # Limit to 3 for demo speed
            try:
                # Firecrawl scrape
                scraped_data = firecrawl.scrape_url(url)
                if isinstance(scraped_data, dict) and "markdown" in scraped_data:
                     content = scraped_data["markdown"]
                else:
                     content = str(scraped_data)

                raw_jobs.append(Job(
                    title="Unknown Title", # Will be extracted later
                    company="Unknown Company",
                    location="Unknown Location",
                    link=url,
                    source="Web",
                    description_raw=content
                ))
            except Exception as e:
                print(f"Failed to scrape {url}: {e}")
    
    if not raw_jobs:
        # Fallback mock data if scraping fails or no key
        print("Using mock scraped data (No Firecrawl Key or Scrape Failed)")
        raw_jobs = [
            Job(
                title="Data Science Intern",
                company="Tech Solutions",
                location="Hyderabad (Hybrid)",
                link="https://linkedin.com/jobs/view/mock1",
                source="LinkedIn",
                description_raw="We are looking for a Data Science Intern in Hyderabad. Skills: Python, SQL, ML. Stochastic Gradient Descent knowledge required."
            ),
            Job(
                title="Full Stack Developer",
                company="StartupHub",
                location="Remote",
                link="https://indeed.com/viewjob?jk=mock2",
                source="Indeed",
                description_raw="Join our team as a Full Stack Dev. React, Node.js, Next.js required. Salary: $50k-$80k."
            )
        ]
        
    return {"raw_jobs": raw_jobs}

def structure_jobs_node(state: AppState) -> Dict[str, Any]:
    """Structures raw job descriptions into standard schema using Gemini."""
    print("Structuring job data...")
    structured_jobs = []
    
    if os.getenv("GOOGLE_API_KEY"):
        extractor = llm.with_structured_output(JobStructured)
        
        for job in state["raw_jobs"]:
            try:
                prompt = f"""
                Extract structured job details from the following description. 
                Keep the link as: {job.link}
                Source: {job.source}
                
                Description:
                {job.description_raw[:10000]} # Limit context
                """
                structured = extractor.invoke(prompt)
                # Ensure the link is preserved if LLM hallucinates
                structured.link = job.link 
                
                # Simple matching logic (could be more advanced)
                query_terms = state["query"].lower().split()
                score = 0
                reasoning = []
                
                if any(term in structured.title.lower() for term in query_terms):
                    score += 30
                    reasoning.append("Title matches query.")
                
                if structured.skills_required:
                    matched_skills = [s for s in structured.skills_required if s.lower() in state["query"].lower()]
                    if matched_skills:
                        score += 20
                        reasoning.append(f"Skills match: {', '.join(matched_skills)}.")
                
                if structured.location and any(l in structured.location.lower() for l in query_terms):
                    score += 20
                    reasoning.append("Location matches.")

                structured.match_score = min(score + 30, 100) # Base score
                structured.match_reasoning = " ".join(reasoning) if reasoning else "General match."

                structured_jobs.append(structured)
            except Exception as e:
                print(f"Extraction Error: {e}")
                # Fallback to raw copy if extraction fails
                structured_jobs.append(JobStructured(**job.dict(), match_score=50, match_reasoning="Auto-extraction failed."))
    else:
        # Mock structuring
        for job in state["raw_jobs"]:
            structured_jobs.append(JobStructured(
                 **job.dict(),
                 match_score=85.0,
                 match_reasoning="Mock structured data (No API Key).",
                 skills_required=["Python", "React"]
            ))

    return {"structured_jobs": structured_jobs}

def recommendation_node(state: AppState) -> Dict[str, Any]:
    """Generates final recommendations based on structured jobs."""
    print("Generating recommendations...")
    
    # Sort by match score
    sorted_jobs = sorted(state["structured_jobs"], key=lambda x: x.match_score or 0, reverse=True)
    top_jobs = sorted_jobs[:5]
    
    if os.getenv("GOOGLE_API_KEY"):
        prompt = f"""
        User Query: {state['query']}
        
        Top Job Matches:
        {top_jobs}
        
        Generate a helpful, professional response recommending these jobs.
        Highlight why the top choice is good.
        Keep it concise but encouraging.
        """
        response = llm.invoke(prompt)
        final_msg = response.content
    else:
        final_msg = f"I found {len(top_jobs)} great opportunities for you! The top match is {top_jobs[0].title} at {top_jobs[0].company}."

    return {"final_answer": final_msg, "structured_jobs": top_jobs}

def normal_chat_node(state: AppState) -> Dict[str, Any]:
    """Handles non-job queries."""
    if os.getenv("GOOGLE_API_KEY"):
        response = llm.invoke(state["query"])
        return {"final_answer": response.content}
    return {"final_answer": "I am a job assistant. Please ask me about job opportunities!"}
