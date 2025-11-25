from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from agents.orchestrator import OrchestratorAgent
from agents.resume_reviewer import ResumeReviewerAgent
from typing import List, Optional, Dict
import pypdf
import io
import os

app = FastAPI(title="Multi-Agent Job Assistant")

# CORS - Use environment variable for production, allow all for development
frontend_url = os.getenv("FRONTEND_URL", "")
if frontend_url:
    allowed_origins = [url.strip() for url in frontend_url.split(",")]
else:
    allowed_origins = ["*"]  # Development mode

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = OrchestratorAgent()
resume_agent = ResumeReviewerAgent()

# Root endpoint for health check
@app.get("/")
async def root():
    return {
        "status": "ok",
        "message": "Job Agent API is running",
        "cors_origins": allowed_origins
    }

class ChatRequest(BaseModel):
    message: str
    context: Optional[dict] = {}

class ProfileUpdate(BaseModel):
    name: str
    email: str
    role: str
    location: str
    salary_min: str
    salary_max: str
    skills: List[str]
    preferences: Dict

from database import db

@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        result = orchestrator.process_message(request.message, request.context)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/dashboard")
async def get_dashboard():
    return db.get_dashboard_stats()

@app.get("/api/jobs")
async def get_jobs():
    return db.get_jobs()

@app.get("/api/learning")
async def get_learning():
    return db.get_latest_learning_path()

@app.get("/api/learning/all")
async def get_all_learning():
    return db.get_all_learning_paths()

@app.get("/api/resume")
async def get_resume():
    return db.get_latest_resume_review()

# Skill Testing Endpoints
@app.get("/api/tests")
async def get_all_tests():
    """Get all available skill tests"""
    return db.get_all_skill_tests()

@app.get("/api/tests/{test_id}")
async def get_test(test_id: str):
    """Get a specific test by ID"""
    test = db.get_skill_test(test_id)
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    return test

@app.post("/api/tests/{test_id}/submit")
async def submit_test(test_id: str, answers: Dict, time_taken: int = 0):
    """Submit test answers and get results"""
    from agents.learning_agent import LearningAgent
    learning_agent = LearningAgent()
    
    result = learning_agent.evaluate_test(test_id, answers)
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"])
    
    # Save result to database
    db.save_test_result(
        test_id,
        result["score"],
        result["total"],
        answers,
        result["feedback"],
        time_taken
    )
    
    return result

@app.get("/api/tests/results")
async def get_test_results():
    """Get all test results for the user"""
    return db.get_test_results()

@app.get("/api/activity")
async def get_activity():
    """Get recent user activity"""
    return {
        "recent": db.get_recent_activities(20),
        "stats": db.get_activity_stats(7)
    }


@app.post("/api/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        
        # Extract text from PDF
        text = ""
        if file.filename.endswith('.pdf'):
            pdf_file = io.BytesIO(content)
            reader = pypdf.PdfReader(pdf_file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
        else:
            # Assume text/markdown for other formats for now, or error
            text = content.decode('utf-8', errors='ignore')
            
        if not text.strip():
             raise HTTPException(status_code=400, detail="Could not extract text from file")

        # Analyze with AI Agent
        review = resume_agent.review(text)
        
        # Save to DB
        db.add_resume_review(review.dict())
        
        return review
    except Exception as e:
        print(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")

@app.get("/api/profile")
async def get_profile():
    return db.get_user_profile()

@app.put("/api/profile")
async def update_profile(profile: ProfileUpdate):
    db.update_user_profile(profile.dict())
    return {"status": "updated"}

@app.get("/api/chat/history")
async def get_history():
    session = db.get_active_session()
    return session["messages"]

@app.get("/api/chat/sessions")
async def get_sessions():
    return list(db.chat_sessions.values())

@app.post("/api/chat/sessions")
async def create_session():
    session_id = db.create_session()
    return db.chat_sessions[session_id]

@app.put("/api/chat/sessions/{session_id}/activate")
async def activate_session(session_id: str):
    if db.switch_session(session_id):
        return {"status": "activated", "session": db.get_active_session()}
    raise HTTPException(status_code=404, detail="Session not found")

@app.delete("/api/chat/sessions/{session_id}")
async def delete_session(session_id: str):
    if db.delete_session(session_id):
        return {"status": "deleted"}
    raise HTTPException(status_code=400, detail="Cannot delete last session or session not found")

@app.post("/api/jobs/{job_id}/apply")
async def apply_job(job_id: str):
    success = db.mark_job_applied(job_id)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found")
    return {"status": "applied"}

@app.put("/api/jobs/{job_id}/status")
async def update_job_status(job_id: str, status: str, notes: str = None):
    success = db.update_job_application_status(job_id, status, notes)
    if not success:
        raise HTTPException(status_code=404, detail="Job not found or not applied")
    return {"status": "updated"}

@app.get("/api/learning/test")
async def get_test():
    return db.mock_tests[-1] if db.mock_tests else None

@app.get("/api/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
