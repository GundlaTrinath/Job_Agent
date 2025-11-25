from typing import List, Dict
from llm_engine import generate_json_response
import json

class SkillAdvisorAgent:
    def generate_test(self, skill: str, difficulty: str = "intermediate") -> List[Dict]:
        """
        Generates test questions for a specific skill.
        """
        prompt = f"""
        Create 5 multiple-choice questions to test knowledge of: {skill}
        Difficulty: {difficulty}
        
        Include a mix of:
        - Conceptual questions
        - Practical application questions
        - Best practices
        
        Return JSON format (array of questions):
        [
            {{
                "id": 1,
                "question": "What is...?",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A",
                "explanation": "Detailed explanation..."
            }}
        ]
        """
        
        try:
            response_text = generate_json_response(prompt)
            questions = json.loads(response_text)
            return questions if isinstance(questions, list) else []
        except Exception as e:
            print(f"Failed to generate test for {skill}: {e}")
            return [
                {
                    "id": 1,
                    "question": f"What is the primary use of {skill}?",
                    "options": ["Web Development", "Data Analysis", "System Administration", "All of the above"],
                    "correct_answer": "All of the above",
                    "explanation": f"{skill} is a versatile technology."
                }
            ]

    def analyze_gap(self, current_skills: List[str], desired_role: str, user_context: dict = None) -> dict:
        """
        Uses LLM to analyze skill gaps and provide learning resources.
        Now tracks learned skills from previous interactions.
        """
        # Get already learned skills from context
        learned_skills = []
        if user_context:
            learned_skills = user_context.get("preferences", {}).get("learned_skills", [])
        
        all_current_skills = list(set(current_skills + learned_skills))
        
        prompt = f"""
        Act as a career coach.
        User wants to be a: {desired_role}
        User currently knows: {', '.join(all_current_skills) if all_current_skills else 'Nothing specified'}
        User has been learning: {', '.join(learned_skills) if learned_skills else 'Just starting'}
        
        Identify 3 critical missing skills for this role that the user hasn't learned yet.
        For each skill, provide a specific learning resource URL (official docs or popular tutorials).
        
        Return JSON format:
        {{
            "missing_skills": ["Skill1", "Skill2"],
            "recommendations": [
                {{"skill": "Skill1", "resource": "url", "type": "Documentation"}},
                {{"skill": "Skill2", "resource": "url", "type": "Course"}}
            ],
            "message": "Encouraging advice..."
        }}
        """
        
        try:
            response_text = generate_json_response(prompt)
            advice = json.loads(response_text)
            
            # Track recommended skills as "learned" for next time
            if user_context:
                from database import db
                new_skills = [rec["skill"] for rec in advice.get("recommendations", [])]
                current_learned = db.get_user_profile().get("preferences", {}).get("learned_skills", [])
                current_learned.extend(new_skills)
                db.update_user_preference("learned_skills", current_learned)
            
            return advice
        except Exception as e:
            return {
                "missing_skills": ["Python", "React"],
                "recommendations": [
                    {"skill": "Python", "resource": "https://docs.python.org", "type": "Documentation"}
                ],
                "message": "Keep learning!"
            }

