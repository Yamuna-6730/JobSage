from pydantic import BaseModel, Field
from typing import List, Optional

class Job(BaseModel):
    title: str = Field(description="The job title")
    company: str = Field(description="The company name")
    location: str = Field(description="Job location")
    link: str = Field(description="URL to the job posting")
    source: str = Field(description="Source of the job (LinkedIn, Indeed, etc.)")
    description_raw: Optional[str] = Field(None, description="Raw text of job description")

class JobStructured(Job):
    work_mode: Optional[str] = Field(None, description="Remote, Hybrid, Onsite, or Unknown")
    experience_required: Optional[str] = Field(None, description="Years of experience required")
    skills_required: List[str] = Field(default_factory=list, description="List of required skills")
    education: Optional[str] = Field(None, description="Education requirements")
    salary_or_stipend: Optional[str] = Field(None, description="Salary or stipend information")
    responsibilities: List[str] = Field(default_factory=list, description="Key responsibilities")
    summary: Optional[str] = Field(None, description="Brief summary of the role")
    match_score: Optional[float] = Field(None, description="Relevance score (0-100)")
    match_reasoning: Optional[str] = Field(None, description="Why this job was recommended")

class JobRecommendation(BaseModel):
    jobs: List[JobStructured] = Field(default_factory=list)
    final_message: str = Field(description="Final response to the user")
