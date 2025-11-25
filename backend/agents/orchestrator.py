from .job_search import JobSearchAgent
from .skill_advisor import SkillAdvisorAgent
from .resume_reviewer import ResumeReviewerAgent
from .learning_agent import LearningAgent
from llm_engine import generate_json_response
from database import db
import json

class OrchestratorAgent:
    def __init__(self):
        self.job_search = JobSearchAgent()
        self.skill_advisor = SkillAdvisorAgent()
        self.resume_reviewer = ResumeReviewerAgent()
        self.learning_agent = LearningAgent()

    def process_message(self, message: str, context: dict = {}) -> dict:
        # Save User Message
        db.add_message("user", message)

        # Get Chat History for Context
        user_context = db.get_user_context()
        history_str = "\n".join([f"{msg['role']}: {msg['content']}" for msg in user_context.get("chat_history", [])[-5:]])
        user_profile = user_context.get("profile", {})

        prompt = f"""
        You are an Orchestrator Agent. Route the user's request.
        
        Chat History:
        {history_str}
        
        User Message: "{message}"
        User Profile Location: {user_profile.get('location', 'Not specified')}
        User Skills: {', '.join(user_profile.get('skills', [])) if user_profile.get('skills') else 'Not specified'}
        
        Available Agents:
        1. JobSearch: Finding jobs, job hunting, career opportunities.
        2. SkillAdvisor: Advice on skills, learning paths, career guidance.
        3. ResumeReviewer: Resume feedback and analysis.
        4. LearningAgent: Creating mock tests, quizzes, skill assessments.
        5. Chat: General conversation, greetings, questions, asking for clarification.
        
        Return JSON:
        {{
            "agent": "JobSearch" | "SkillAdvisor" | "ResumeReviewer" | "LearningAgent" | "Chat",
            "reasoning": "...",
            "needs_clarification": true/false,
            "missing_info": ["location", "job_role", "experience_level"] (if needs_clarification is true)
        }}
        """
        
        try:
            response_text = generate_json_response(prompt)
            decision = json.loads(response_text)
            agent_name = decision.get("agent", "Chat")
            reasoning = decision.get("reasoning", "Defaulting to chat")
            needs_clarification = decision.get("needs_clarification", False)
            missing_info = decision.get("missing_info", [])
        except:
            agent_name = "Chat"
            reasoning = "Error in routing"
            needs_clarification = False
            missing_info = []

        response_data = None
        agent_response = ""
        jobs_found = []

        if agent_name == "JobSearch":
            # Check if we need to ask clarifying questions
            if needs_clarification and missing_info:
                clarification_prompt = f"""
                The user wants to search for jobs: "{message}"
                
                We need more information: {', '.join(missing_info)}
                
                Create a friendly, conversational response asking for the missing information.
                Be specific and helpful. For example:
                - If missing location: "I'd love to help you find jobs! What location are you looking for?"
                - If missing job role: "What type of position are you interested in?"
                - If missing experience: "How many years of experience do you have?"
                
                Return just the question text, no JSON.
                """
                
                try:
                    from llm_engine import generate_response
                    agent_response = generate_response(clarification_prompt)
                except:
                    agent_response = f"I'd love to help! Could you tell me more about: {', '.join(missing_info)}?"
                
                db.add_message("agent", agent_response, "Chat")
                return {
                    "agent": "Chat",
                    "response": agent_response,
                    "data": None,
                    "reasoning": "Asking for clarification",
                    "needs_clarification": True
                }
            
            # Search for jobs
            jobs = self.job_search.search(message, user_context)
            db.add_jobs([job.dict() for job in jobs])
            jobs_found = [job.dict() for job in jobs]
            response_data = jobs_found
            
            # Log activity
            db.log_activity("job_search", {"query": message, "results_count": len(jobs)})
            
            # Extract unique skills from all jobs
            all_skills = set()
            for job in jobs:
                all_skills.update(job.requirements)
            
            # Get user's current skills
            user_skills = set(user_context.get("profile", {}).get("skills", []))
            
            # Identify skill gaps
            skill_gaps = list(all_skills - user_skills)
            
            # Auto-generate learning paths for skill gaps
            if skill_gaps:
                for skill in skill_gaps[:3]:  # Limit to top 3 gaps
                    try:
                        learning_path = self.learning_agent.create_learning_path(skill, jobs_found)
                        db.update_learning_path(learning_path)
                        db.log_activity("learning_started", {"skill": skill, "auto_generated": True})
                    except Exception as e:
                        print(f"Failed to create learning path for {skill}: {e}")
                
                # Auto-generate skill tests for top gaps
                for skill in skill_gaps[:2]:  # Top 2 skills
                    try:
                        test_questions = self.skill_advisor.generate_test(skill, "intermediate")
                        job_ids = [job.id for job in jobs if skill in job.requirements]
                        db.create_skill_test(skill, "intermediate", test_questions, job_ids)
                    except Exception as e:
                        print(f"Failed to create test for {skill}: {e}")
            
            # Build response
            location_msg = ""
            if user_context.get("preferences", {}).get("preferred_location"):
                location_msg = f" in {user_context['preferences']['preferred_location']}"
            
            agent_response = f"🎯 I've found {len(jobs)} real job opportunities{location_msg}!\n\n"
            agent_response += f"✨ These are live positions from company websites. Click 'Apply Now' to go directly to the company's job portal.\n\n"
            
            if skill_gaps:
                agent_response += f"📚 I've also created learning paths for: {', '.join(skill_gaps[:3])}\n"
                agent_response += f"✅ Skill tests are ready for: {', '.join(skill_gaps[:2])}\n\n"
            
            agent_response += "💼 Go to the Job Board to view all opportunities and apply directly on company websites!"
            
        elif agent_name == "SkillAdvisor":
            role = "software developer"
            if "data" in message.lower(): role = "data scientist"
            if "frontend" in message.lower(): role = "frontend developer"
            if "backend" in message.lower(): role = "backend developer"
            
            # Update preferred role
            db.update_user_preference("preferred_role", role)
            
            advice = self.skill_advisor.analyze_gap(user_context.get("profile", {}).get("skills", []), role, user_context)
            db.update_learning_path(advice)
            response_data = advice
            agent_response = advice.get("message", "Advice generated. Check Learning Hub for your personalized path.")
            
            db.log_activity("skill_advice", {"role": role})
            
        elif agent_name == "ResumeReviewer":
            resume_text = context.get("resume_text", message)
            review = self.resume_reviewer.review(resume_text)
            db.add_resume_review(review.dict())
            response_data = review.dict()
            agent_response = f"📄 Resume reviewed! Score: {review.score}/100.\n\nCheck the Resume page for detailed feedback."
            
            db.log_activity("resume_review", {"score": review.score})

        elif agent_name == "LearningAgent":
            # Extract topic
            topic = "General"
            if "python" in message.lower(): topic = "Python"
            elif "react" in message.lower(): topic = "React"
            elif "javascript" in message.lower(): topic = "JavaScript"
            
            test = self.learning_agent.generate_test(topic)
            response_data = test
            agent_response = f"📝 I've generated a {topic} mock test for you! Check the Learning Hub to take it."
            
        else:
            # Use LLM for general chat response
            chat_prompt = f"""
            User said: "{message}"
            
            Respond as a helpful AI career assistant. Be friendly and guide them on what you can help with:
            - Finding jobs
            - Skill development and learning paths
            - Resume reviews
            - Mock tests and skill assessments
            
            Keep response concise (2-3 sentences).
            """
            try:
                from llm_engine import generate_response
                agent_response = generate_response(chat_prompt)
            except:
                agent_response = "Hi! I can help you find jobs, develop skills, review your resume, or take skill tests. What would you like to do?"

        # Save Agent Response
        db.add_message("agent", agent_response, agent_name)

        return {
            "agent": agent_name,
            "response": agent_response,
            "data": response_data,
            "reasoning": reasoning,
            "jobs_found": len(jobs_found) if jobs_found else 0
        }

