from typing import List, Dict
from llm_engine import generate_json_response
import json
from database import db

class LearningAgent:
    def create_learning_path(self, skill: str, jobs: List[Dict] = None) -> Dict:
        """
        Creates a learning path for a specific skill, optionally based on job requirements.
        """
        job_context = ""
        if jobs:
            job_titles = [job.get("title", "") for job in jobs[:3]]
            job_context = f"\nThis skill is required for: {', '.join(job_titles)}"
        
        prompt = f"""
        Create a comprehensive learning path for learning: {skill}
        {job_context}
        
        Include:
        1. Prerequisites (if any)
        2. Core concepts to master
        3. Learning resources (official docs, popular courses)
        4. Practice projects
        5. Interview preparation tips
        
        Return JSON format:
        {{
            "skill": "{skill}",
            "duration_weeks": 4,
            "prerequisites": ["Skill1", "Skill2"],
            "milestones": [
                {{
                    "week": 1,
                    "title": "Fundamentals",
                    "topics": ["Topic1", "Topic2"],
                    "resources": [{{"name": "Resource", "url": "https://..."}}]
                }}
            ],
            "practice_projects": ["Project1", "Project2"],
            "interview_tips": ["Tip1", "Tip2"]
        }}
        """
        
        try:
            response_text = generate_json_response(prompt)
            learning_path = json.loads(response_text)
            learning_path["auto_generated"] = True
            learning_path["created_from_jobs"] = [job.get("id") for job in jobs] if jobs else []
            return learning_path
        except Exception as e:
            print(f"Failed to create learning path: {e}")
            return {
                "skill": skill,
                "duration_weeks": 4,
                "prerequisites": [],
                "milestones": [{"week": 1, "title": "Getting Started", "topics": [f"Learn {skill} basics"]}],
                "practice_projects": [],
                "interview_tips": []
            }

    def generate_test(self, topic: str, difficulty: str = "Intermediate") -> Dict:
        """
        Generates a mock test using LLM.
        """
        prompt = f"""
        Create a multiple-choice mock test for: {topic}
        Difficulty: {difficulty}
        Number of questions: 5
        
        Return JSON format:
        {{
            "topic": "{topic}",
            "questions": [
                {{
                    "id": 1,
                    "question": "Question text...",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correct_answer": "Option A",
                    "explanation": "Why this is correct..."
                }}
            ]
        }}
        """
        
        try:
            response_text = generate_json_response(prompt)
            test_data = json.loads(response_text)
            return test_data
        except Exception as e:
            return {"error": "Failed to generate test", "topic": topic}

    def evaluate_test(self, test_id: str, user_answers: Dict[str, str]) -> Dict:
        """
        Evaluates a test by comparing user answers to correct answers.
        """
        test = db.get_skill_test(test_id)
        if not test:
            return {"error": "Test not found"}
        
        questions = test.get("questions", [])
        score = 0
        feedback = []
        
        for q in questions:
            q_id = str(q.get("id"))
            user_answer = user_answers.get(q_id)
            correct_answer = q.get("correct_answer")
            
            is_correct = user_answer == correct_answer
            if is_correct:
                score += 1
            
            feedback.append({
                "question_id": q_id,
                "question": q.get("question"),
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "is_correct": is_correct,
                "explanation": q.get("explanation", "")
            })
        
        return {
            "score": score,
            "total": len(questions),
            "percentage": round((score / len(questions)) * 100, 2) if questions else 0,
            "feedback": feedback
        }

