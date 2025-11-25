from pydantic import BaseModel
from typing import List, Optional

class UserProfile(BaseModel):
    name: str
    skills: List[str]
    experience_years: int
    interests: List[str]

class JobPosting(BaseModel):
    id: str
    title: str
    company: str
    description: str
    requirements: List[str]
    location: str
    salary_range: Optional[str] = None

class ChatMessage(BaseModel):
    role: str  # "user" or "agent"
    content: str
    agent_name: Optional[str] = None # "JobSearch", "SkillAdvisor", "ResumeReviewer", "Orchestrator"

class ResumeReview(BaseModel):
    score: int
    feedback: List[str]
    improved_version: Optional[str] = None
