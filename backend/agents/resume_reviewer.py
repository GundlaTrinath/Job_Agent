from models import ResumeReview
from llm_engine import generate_json_response
import json

class ResumeReviewerAgent:
    def review(self, resume_text: str) -> ResumeReview:
        """
        Reviews the resume text using LLM.
        """
        prompt = f"""
        Act as an expert resume reviewer.
        Review the following resume text:
        "{resume_text}"
        
        Provide a score out of 100.
        Provide 3-5 specific, actionable bullet points of feedback.
        
        Return JSON format:
        {{
            "score": 85,
            "feedback": ["Point 1", "Point 2"]
        }}
        """
        
        try:
            response_text = generate_json_response(prompt)
            data = json.loads(response_text)
            return ResumeReview(
                score=data.get("score", 70),
                feedback=data.get("feedback", ["Add more details."]),
                improved_version=None
            )
        except Exception as e:
            return ResumeReview(
                score=50,
                feedback=["Could not analyze resume. Please try again."],
                improved_version=None
            )
