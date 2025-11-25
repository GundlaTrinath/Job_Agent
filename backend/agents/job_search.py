from typing import List
from models import JobPosting
from llm_engine import generate_json_response
from database import db
import json
from duckduckgo_search import DDGS
import random

MOCK_JOBS = [
    # Python Jobs
    JobPosting(
        id="1",
        title="Senior Python Developer",
        company="TechCorp India",
        description="We are looking for an experienced Python developer to join our backend team in Hyderabad.",
        requirements=["Python", "FastAPI", "SQL", "AWS"],
        location="Hyderabad",
        salary_range="₹20L - ₹30L"
    ),
    JobPosting(
        id="2",
        title="Python Backend Engineer",
        company="DataSoft Solutions",
        description="Build scalable backend systems with Python and Django.",
        requirements=["Python", "Django", "PostgreSQL", "Redis"],
        location="Bangalore",
        salary_range="₹18L - ₹25L"
    ),
    # Frontend Jobs
    JobPosting(
        id="3",
        title="Frontend Engineer",
        company="CreativeSolutions",
        description="Build beautiful user interfaces with React in our Mumbai office.",
        requirements=["React", "JavaScript", "CSS", "Tailwind"],
        location="Mumbai",
        salary_range="₹15L - ₹22L"
    ),
    JobPosting(
        id="4",
        title="React Developer",
        company="WebWorks India",
        description="Join our frontend team to create amazing web experiences.",
        requirements=["React", "TypeScript", "Redux", "Next.js"],
        location="Hyderabad",
        salary_range="₹12L - ₹18L"
    ),
    # Data Science
    JobPosting(
        id="5",
        title="Data Scientist",
        company="DataGenius Analytics",
        description="Analyze large datasets and build ML models for our Bangalore office.",
        requirements=["Python", "Pandas", "Scikit-learn", "SQL"],
        location="Bangalore",
        salary_range="₹25L - ₹35L"
    ),
    JobPosting(
        id="6",
        title="ML Engineer",
        company="AI Innovations",
        description="Work on cutting-edge machine learning projects.",
        requirements=["Python", "TensorFlow", "PyTorch", "MLOps"],
        location="Hyderabad",
        salary_range="₹22L - ₹32L"
    ),
    # DevOps
    JobPosting(
        id="7",
        title="DevOps Engineer",
        company="CloudSystems India",
        description="Manage our cloud infrastructure and CI/CD pipelines.",
        requirements=["AWS", "Docker", "Kubernetes", "Terraform"],
        location="Pune",
        salary_range="₹20L - ₹28L"
    ),
    JobPosting(
        id="8",
        title="Site Reliability Engineer",
        company="ScaleOps",
        description="Ensure reliability and performance of our production systems.",
        requirements=["Linux", "Python", "Kubernetes", "Monitoring"],
        location="Bangalore",
        salary_range="₹24L - ₹34L"
    ),
    # Java Jobs
    JobPosting(
        id="9",
        title="Java Full Stack Developer",
        company="Enterprise Solutions Ltd",
        description="Develop enterprise applications using Java and Spring Boot.",
        requirements=["Java", "Spring Boot", "MySQL", "Angular"],
        location="Hyderabad",
        salary_range="₹16L - ₹24L"
    ),
]

class JobSearchAgent:
    def search(self, query: str, user_context: dict = None) -> List[JobPosting]:
        """
        Uses LLM to extract keywords AND location, then searches web using DuckDuckGo.
        Falls back to mock jobs if web search fails.
        """
        # Extract search parameters using LLM
        prompt = f"""
        Extract job search parameters from this query: "{query}"
        
        Return JSON with:
        - "keywords": list of technical skills/job titles
        - "location": city name if mentioned (null if not specified)
        
        Example: "Find Python jobs in Hyderabad" -> {{"keywords": ["Python"], "location": "Hyderabad"}}
        """
        
        try:
            response_text = generate_json_response(prompt)
            params = json.loads(response_text)
            keywords = params.get("keywords", [query])
            location = params.get("location")
        except:
            keywords = [query]
            location = None

        # Fall back to user's preferred location if not specified
        if not location and user_context:
            location = user_context.get("preferences", {}).get("preferred_location")

        # Update user's preferred location if a new one is mentioned
        if location and user_context:
            db.update_user_preference("preferred_location", location)

        # Construct search query
        search_query = f"{' '.join(keywords)} jobs"
        if location:
            search_query += f" in {location}"

        print(f"Searching for: {search_query}")

        real_jobs = []
        try:
            with DDGS() as ddgs:
                results = ddgs.text(search_query, max_results=10)
                for i, r in enumerate(results):
                    # Create a JobPosting from the search result
                    # Since DDG returns title, href, body, we need to infer some details
                    title = r.get('title', 'Job Opening')
                    link = r.get('href', '#')
                    snippet = r.get('body', '')
                    
                    # Basic extraction (naive)
                    company = "Unknown Company"
                    if "-" in title:
                        parts = title.split("-")
                        company = parts[-1].strip()
                        title = "-".join(parts[:-1]).strip()
                    
                    real_jobs.append(JobPosting(
                        id=f"web-{i}",
                        title=title,
                        company=company,
                        description=snippet,
                        requirements=keywords, # Assume keywords are requirements
                        location=location if location else "Remote/Unknown",
                        salary_range="Not specified",
                        application_details={"link": link} # Store link to apply
                    ))
        except Exception as e:
            print(f"Web search failed: {e}")

        if real_jobs:
            return real_jobs

        # Fallback to Mock Jobs if no web results
        results = []
        for job in MOCK_JOBS:
            match_score = 0
            job_text = (job.title + " " + job.description + " " + " ".join(job.requirements)).lower()
            
            # Match keywords
            for keyword in keywords:
                if keyword.lower() in job_text:
                    match_score += 1
            
            # Match location (exact or contains)
            if location:
                if location.lower() in job.location.lower():
                    match_score += 2  # Location match is more important
            
            if match_score > 0:
                results.append(job)
        
        # Sort by relevance
        if location:
            # Prioritize location matches
            results.sort(key=lambda j: (location.lower() in j.location.lower(), j.id), reverse=True)
        
        if not results:
            # If no matches, show jobs from preferred location or all jobs
            if location:
                results = [j for j in MOCK_JOBS if location.lower() in j.location.lower()]
            if not results:
                results = MOCK_JOBS[:3]  # Show first 3 as fallback
            
        return results
