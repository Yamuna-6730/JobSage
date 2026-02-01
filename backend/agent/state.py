from typing import TypedDict, List, Annotated
from agent.schema import Job, JobStructured

class AppState(TypedDict):
    query: str
    job_urls: List[str]
    raw_jobs: List[Job]
    structured_jobs: List[JobStructured]
    final_answer: str
    is_job_query: bool
