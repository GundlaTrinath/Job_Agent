import sqlite3
import json
import datetime
import uuid
from typing import List, Dict, Any

class Database:
    _instance = None
    DB_NAME = "job_agent.db"

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.init_db()
        return cls._instance

    def init_db(self):
        self.conn = sqlite3.connect(self.DB_NAME, check_same_thread=False)
        self.conn.row_factory = sqlite3.Row
        self.cursor = self.conn.cursor()
        self._create_tables()
        self._seed_default_data()

    def _create_tables(self):
        # User Profile Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_profile (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                role TEXT,
                location TEXT,
                salary_min TEXT,
                salary_max TEXT,
                skills TEXT, -- JSON list
                preferences TEXT -- JSON dict
            )
        """)

        # Jobs Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                title TEXT,
                company TEXT,
                description TEXT,
                location TEXT,
                salary_range TEXT,
                requirements TEXT, -- JSON list
                status TEXT,
                application_details TEXT -- JSON dict
            )
        """)

        # Resume Reviews Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS resume_reviews (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                score INTEGER,
                feedback TEXT, -- JSON list
                timestamp TEXT
            )
        """)

        # Learning Paths Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS learning_paths (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                data TEXT, -- JSON dict
                timestamp TEXT
            )
        """)

        # Chat Sessions Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS chat_sessions (
                id TEXT PRIMARY KEY,
                title TEXT,
                messages TEXT, -- JSON list
                created_at TEXT,
                updated_at TEXT
            )
        """)
        
        # Skill Tests Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS skill_tests (
                id TEXT PRIMARY KEY,
                skill_name TEXT,
                difficulty TEXT,
                questions TEXT, -- JSON list of questions
                created_at TEXT,
                job_related_ids TEXT -- JSON list of job IDs this test is for
            )
        """)
        
        # Test Results Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS test_results (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                test_id TEXT,
                score INTEGER,
                total_questions INTEGER,
                answers TEXT, -- JSON dict of answers
                feedback TEXT, -- JSON list of feedback per question
                taken_at TEXT,
                time_taken_seconds INTEGER,
                FOREIGN KEY (test_id) REFERENCES skill_tests(id)
            )
        """)
        
        # User Activity Table
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_activity (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                activity_type TEXT, -- 'job_search', 'job_view', 'job_apply', 'test_taken', 'learning_started'
                activity_data TEXT, -- JSON dict with relevant data
                timestamp TEXT
            )
        """)
        
        self.conn.commit()

    def _seed_default_data(self):
        # Check if user profile exists
        self.cursor.execute("SELECT count(*) FROM user_profile")
        if self.cursor.fetchone()[0] == 0:
            default_profile = {
                "name": "Alex Johnson",
                "email": "alex.johnson@example.com",
                "role": "Senior Frontend Developer",
                "location": "San Francisco, CA",
                "salary_min": "$120,000",
                "salary_max": "$160,000",
                "skills": json.dumps(['React', 'TypeScript', 'Node.js', 'Tailwind CSS']),
                "preferences": json.dumps({
                    "preferred_location": "Remote",
                    "preferred_role": "Frontend Developer",
                    "learned_skills": []
                })
            }
            self.cursor.execute("""
                INSERT INTO user_profile (name, email, role, location, salary_min, salary_max, skills, preferences)
                VALUES (:name, :email, :role, :location, :salary_min, :salary_max, :skills, :preferences)
            """, default_profile)
            self.conn.commit()

        # Create default session if none exists
        self.cursor.execute("SELECT count(*) FROM chat_sessions")
        if self.cursor.fetchone()[0] == 0:
            self.create_session("Welcome Chat")

        # Seed sample jobs if none exist
        self.cursor.execute("SELECT count(*) FROM jobs")
        if self.cursor.fetchone()[0] == 0:
            sample_jobs = [
                {
                    "id": "1",
                    "title": "Senior Frontend Engineer",
                    "company": "TechCorp",
                    "description": "We are looking for an experienced Frontend Engineer to join our team.",
                    "location": "Remote",
                    "salary_range": "₹120,000 - ₹160,000",
                    "requirements": ["React", "TypeScript", "Node.js"],
                    "status": "Saved",
                    "application_details": None
                },
                {
                    "id": "2",
                    "title": "Full Stack Developer",
                    "company": "StartupInc",
                    "description": "Join a fast-paced startup building the future of AI.",
                    "location": "San Francisco, CA",
                    "salary_range": "₹140,000 - ₹180,000",
                    "requirements": ["Python", "React", "FastAPI"],
                    "status": "Saved",
                    "application_details": None
                },
                {
                    "id": "3",
                    "title": "Product Designer",
                    "company": "DesignStudio",
                    "description": "Looking for a creative Product Designer with UI/UX skills.",
                    "location": "New York, NY",
                    "salary_range": "₹100,000 - ₹140,000",
                    "requirements": ["Figma", "Adobe XD", "HTML/CSS"],
                    "status": "Saved",
                    "application_details": None
                }
            ]
            self.add_jobs(sample_jobs)

    # --- Session Management ---
    def create_session(self, title: str = None) -> str:
        session_id = str(uuid.uuid4())[:8]
        if not title:
            # We'll update title later based on first message
            title = "New Chat"
        
        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            INSERT INTO chat_sessions (id, title, messages, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (session_id, title, json.dumps([]), now, now))
        self.conn.commit()
        self.active_session_id = session_id
        return session_id

    def get_active_session(self) -> Dict:
        if not hasattr(self, 'active_session_id') or not self.active_session_id:
            # Get most recent session
            self.cursor.execute("SELECT id FROM chat_sessions ORDER BY updated_at DESC LIMIT 1")
            row = self.cursor.fetchone()
            if row:
                self.active_session_id = row['id']
            else:
                self.active_session_id = self.create_session()
        
        self.cursor.execute("SELECT * FROM chat_sessions WHERE id = ?", (self.active_session_id,))
        row = self.cursor.fetchone()
        if not row:
             # Fallback if active session was deleted
             self.active_session_id = self.create_session()
             return self.get_active_session()

        return {
            "id": row['id'],
            "title": row['title'],
            "messages": json.loads(row['messages']),
            "created_at": row['created_at'],
            "updated_at": row['updated_at']
        }

    def switch_session(self, session_id: str) -> bool:
        self.cursor.execute("SELECT 1 FROM chat_sessions WHERE id = ?", (session_id,))
        if self.cursor.fetchone():
            self.active_session_id = session_id
            return True
        return False

    def delete_session(self, session_id: str) -> bool:
        self.cursor.execute("SELECT count(*) FROM chat_sessions")
        count = self.cursor.fetchone()[0]
        if count <= 1:
            return False # Cannot delete last session

        self.cursor.execute("DELETE FROM chat_sessions WHERE id = ?", (session_id,))
        self.conn.commit()
        
        if self.active_session_id == session_id:
            self.active_session_id = None # Will be reset by get_active_session
        return True

    def add_message(self, role: str, content: str, agent_name: str = None):
        session = self.get_active_session()
        messages = session["messages"]
        messages.append({
            "role": role,
            "content": content,
            "agent_name": agent_name,
            "timestamp": datetime.datetime.now().isoformat()
        })
        
        # Update title if it's the first user message
        title = session["title"]
        if len(messages) == 1 and role == "user":
            title = content[:50] + ("..." if len(content) > 50 else "")
        elif len(messages) == 2 and role == "user" and session["title"] == "New Chat": # Handle case where welcome message exists
             title = content[:50] + ("..." if len(content) > 50 else "")

        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            UPDATE chat_sessions 
            SET messages = ?, title = ?, updated_at = ?
            WHERE id = ?
        """, (json.dumps(messages), title, now, session["id"]))
        self.conn.commit()

    # --- User Profile ---
    def get_user_profile(self) -> Dict:
        self.cursor.execute("SELECT * FROM user_profile LIMIT 1")
        row = self.cursor.fetchone()
        if row:
            return {
                "name": row['name'],
                "email": row['email'],
                "role": row['role'],
                "location": row['location'],
                "salary_min": row['salary_min'],
                "salary_max": row['salary_max'],
                "skills": json.loads(row['skills']),
                "preferences": json.loads(row['preferences'])
            }
        return {}

    def update_user_profile(self, data: Dict):
        # Fetch current to merge
        current = self.get_user_profile()
        updated = {**current, **data}
        
        self.cursor.execute("""
            UPDATE user_profile
            SET name = :name, email = :email, role = :role, location = :location,
                salary_min = :salary_min, salary_max = :salary_max, 
                skills = :skills, preferences = :preferences
            WHERE id = (SELECT id FROM user_profile LIMIT 1)
        """, {
            "name": updated['name'],
            "email": updated['email'],
            "role": updated['role'],
            "location": updated['location'],
            "salary_min": updated['salary_min'],
            "salary_max": updated['salary_max'],
            "skills": json.dumps(updated['skills']),
            "preferences": json.dumps(updated['preferences'])
        })
        self.conn.commit()

    def update_user_preference(self, key: str, value: Any):
        """Update a specific preference key in user profile"""
        profile = self.get_user_profile()
        preferences = profile.get('preferences', {})
        preferences[key] = value
        
        self.cursor.execute("""
            UPDATE user_profile
            SET preferences = ?
            WHERE id = (SELECT id FROM user_profile LIMIT 1)
        """, (json.dumps(preferences),))
        self.conn.commit()

    def get_user_context(self) -> Dict:
        profile = self.get_user_profile()
        session = self.get_active_session()
        return {
            "preferences": profile.get("preferences", {}),
            "profile": profile,
            "chat_history": session["messages"][-5:]
        }

    # --- Jobs ---
    def add_jobs(self, jobs: List[Dict]):
        for j in jobs:
            # Check if exists
            self.cursor.execute("SELECT 1 FROM jobs WHERE id = ?", (j['id'],))
            if not self.cursor.fetchone():
                self.cursor.execute("""
                    INSERT INTO jobs (id, title, company, description, location, salary_range, requirements, status, application_details)
                    VALUES (:id, :title, :company, :description, :location, :salary_range, :requirements, :status, :application_details)
                """, {
                    "id": j['id'],
                    "title": j['title'],
                    "company": j['company'],
                    "description": j['description'],
                    "location": j.get('location', 'Remote'),
                    "salary_range": j.get('salary_range', 'Not specified'),
                    "requirements": json.dumps(j.get('requirements', [])),
                    "status": "Saved",
                    "application_details": None
                })
        self.conn.commit()

    def get_jobs(self) -> List[Dict]:
        self.cursor.execute("SELECT * FROM jobs")
        rows = self.cursor.fetchall()
        jobs = []
        for row in rows:
            jobs.append({
                "id": row['id'],
                "title": row['title'],
                "company": row['company'],
                "description": row['description'],
                "location": row['location'],
                "salary_range": row['salary_range'],
                "requirements": json.loads(row['requirements']),
                "status": row['status'],
                "application_details": json.loads(row['application_details']) if row['application_details'] else None
            })
        return jobs

    def mark_job_applied(self, job_id: str) -> bool:
        now = datetime.datetime.now().isoformat()
        details = json.dumps({
            "applied_date": now,
            "status": "Applied",
            "notes": ""
        })
        self.cursor.execute("""
            UPDATE jobs 
            SET status = 'Applied', application_details = ?
            WHERE id = ?
        """, (details, job_id))
        self.conn.commit()
        return self.cursor.rowcount > 0

    def update_job_application_status(self, job_id: str, status: str, notes: str = None) -> bool:
        self.cursor.execute("SELECT application_details FROM jobs WHERE id = ?", (job_id,))
        row = self.cursor.fetchone()
        if not row or not row['application_details']:
            return False
        
        details = json.loads(row['application_details'])
        details['status'] = status
        if notes:
            details['notes'] = notes
            
        self.cursor.execute("""
            UPDATE jobs 
            SET application_details = ?
            WHERE id = ?
        """, (json.dumps(details), job_id))
        self.conn.commit()
        return True

    # --- Resume ---
    def add_resume_review(self, review: Dict):
        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            INSERT INTO resume_reviews (score, feedback, timestamp)
            VALUES (?, ?, ?)
        """, (review['score'], json.dumps(review['feedback']), now))
        self.conn.commit()

    def get_latest_resume_review(self) -> Dict:
        self.cursor.execute("SELECT * FROM resume_reviews ORDER BY id DESC LIMIT 1")
        row = self.cursor.fetchone()
        if row:
            return {
                "score": row['score'],
                "feedback": json.loads(row['feedback']),
                "timestamp": row['timestamp']
            }
        return {}

    # --- Learning ---
    def update_learning_path(self, path: Dict):
        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            INSERT INTO learning_paths (data, timestamp)
            VALUES (?, ?)
        """, (json.dumps(path), now))
        self.conn.commit()

    def get_latest_learning_path(self) -> Dict:
        self.cursor.execute("SELECT * FROM learning_paths ORDER BY id DESC LIMIT 1")
        row = self.cursor.fetchone()
        if row:
            return json.loads(row['data'])
        return {}
    
    def get_all_learning_paths(self) -> List[Dict]:
        self.cursor.execute("SELECT * FROM learning_paths ORDER BY id DESC")
        rows = self.cursor.fetchall()
        return [{"timestamp": r['timestamp'], "data": json.loads(r['data'])} for r in rows]

    # --- Stats ---
    def get_dashboard_stats(self):
        self.cursor.execute("SELECT count(*) FROM jobs")
        total_jobs = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT count(*) FROM jobs WHERE status = 'Applied'")
        jobs_applied = self.cursor.fetchone()[0]
        
        self.cursor.execute("SELECT count(*) FROM learning_paths")
        active_learning_paths = self.cursor.fetchone()[0]
        
        latest_resume = self.get_latest_resume_review()
        resume_score = latest_resume.get("score", 0)
        
        return {
            "total_jobs": total_jobs,
            "jobs_applied": jobs_applied,
            "active_learning_paths": active_learning_paths,
            "resume_score": resume_score,
            "recent_activity": self._get_recent_activity(),
            "application_history": self._get_application_history()
        }

    def _get_recent_activity(self):
        activity = []
        # Recent jobs
        self.cursor.execute("SELECT title FROM jobs ORDER BY rowid DESC LIMIT 3")
        for row in self.cursor.fetchall():
            activity.append(f"Found job: {row['title']}")
            
        # Recent resume
        self.cursor.execute("SELECT score FROM resume_reviews ORDER BY id DESC LIMIT 2")
        for row in self.cursor.fetchall():
            activity.append(f"Resume reviewed: Score {row['score']}")
            
        return activity

    def _get_application_history(self):
        # Get applications grouped by date for the last 7 days
        history = []
        today = datetime.date.today()
        for i in range(6, -1, -1):
            date = today - datetime.timedelta(days=i)
            date_str = date.isoformat()
            
            # Count jobs applied on this date (using the JSON application_details)
            # Note: This is a bit complex in SQLite with JSON, so we'll do a simpler approximation or fetch all and filter in python
            # For production readiness with SQLite JSON, we can use LIKE or just fetch applied jobs
            
            count = 0
            self.cursor.execute("SELECT application_details FROM jobs WHERE status = 'Applied'")
            rows = self.cursor.fetchall()
            for row in rows:
                if row['application_details']:
                    details = json.loads(row['application_details'])
                    if details.get('applied_date', '').startswith(date_str):
                        count += 1
            
            history.append({
                "name": date.strftime("%a"), # Mon, Tue, etc.
                "jobs": count
            })
        return history

    @property
    def chat_sessions(self):
        # Helper to maintain compatibility with some existing code that might iterate sessions
        # Ideally we should replace usages, but for now we can return a dict of all sessions
        self.cursor.execute("SELECT * FROM chat_sessions")
        sessions = {}
        for row in self.cursor.fetchall():
            sessions[row['id']] = {
                "id": row['id'],
                "title": row['title'],
                "messages": json.loads(row['messages']),
                "created_at": row['created_at'],
                "updated_at": row['updated_at']
            }
        return sessions

    # --- Skill Tests ---
    def create_skill_test(self, skill_name: str, difficulty: str, questions: List[Dict], job_ids: List[str] = None) -> str:
        test_id = str(uuid.uuid4())[:8]
        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            INSERT INTO skill_tests (id, skill_name, difficulty, questions, created_at, job_related_ids)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (test_id, skill_name, difficulty, json.dumps(questions), now, json.dumps(job_ids or [])))
        self.conn.commit()
        return test_id

    def get_skill_test(self, test_id: str) -> Dict:
        self.cursor.execute("SELECT * FROM skill_tests WHERE id = ?", (test_id,))
        row = self.cursor.fetchone()
        if row:
            return {
                "id": row['id'],
                "skill_name": row['skill_name'],
                "difficulty": row['difficulty'],
                "questions": json.loads(row['questions']),
                "created_at": row['created_at'],
                "job_related_ids": json.loads(row['job_related_ids'])
            }
        return {}

    def get_all_skill_tests(self) -> List[Dict]:
        self.cursor.execute("SELECT * FROM skill_tests ORDER BY created_at DESC")
        tests = []
        for row in self.cursor.fetchall():
            tests.append({
                "id": row['id'],
                "skill_name": row['skill_name'],
                "difficulty": row['difficulty'],
                "question_count": len(json.loads(row['questions'])),
                "created_at": row['created_at']
            })
        return tests

    def save_test_result(self, test_id: str, score: int, total: int, answers: Dict, feedback: List, time_taken: int):
        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            INSERT INTO test_results (test_id, score, total_questions, answers, feedback, taken_at, time_taken_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (test_id, score, total, json.dumps(answers), json.dumps(feedback), now, time_taken))
        self.conn.commit()
        
        # Log activity
        self.log_activity("test_taken", {"test_id": test_id, "score": score, "total": total})

    def get_test_results(self, test_id: str = None) -> List[Dict]:
        if test_id:
            self.cursor.execute("SELECT * FROM test_results WHERE test_id = ? ORDER BY taken_at DESC", (test_id,))
        else:
            self.cursor.execute("SELECT * FROM test_results ORDER BY taken_at DESC")
        
        results = []
        for row in self.cursor.fetchall():
            results.append({
                "id": row['id'],
                "test_id": row['test_id'],
                "score": row['score'],
                "total_questions": row['total_questions'],
                "percentage": round((row['score'] / row['total_questions']) * 100, 2) if row['total_questions'] > 0 else 0,
                "answers": json.loads(row['answers']),
                "feedback": json.loads(row['feedback']),
                "taken_at": row['taken_at'],
                "time_taken_seconds": row['time_taken_seconds']
            })
        return results

    # --- Activity Tracking ---
    def log_activity(self, activity_type: str, activity_data: Dict):
        now = datetime.datetime.now().isoformat()
        self.cursor.execute("""
            INSERT INTO user_activity (activity_type, activity_data, timestamp)
            VALUES (?, ?, ?)
        """, (activity_type, json.dumps(activity_data), now))
        self.conn.commit()

    def get_recent_activities(self, limit: int = 10) -> List[Dict]:
        self.cursor.execute("""
            SELECT * FROM user_activity ORDER BY timestamp DESC LIMIT ?
        """, (limit,))
        
        activities = []
        for row in self.cursor.fetchall():
            activities.append({
                "type": row['activity_type'],
                "data": json.loads(row['activity_data']),
                "timestamp": row['timestamp']
            })
        return activities

    def get_activity_stats(self, days: int = 7) -> Dict:
        cutoff = (datetime.datetime.now() - datetime.timedelta(days=days)).isoformat()
        
        stats = {}
        self.cursor.execute("""
            SELECT activity_type, COUNT(*) as count 
            FROM user_activity 
            WHERE timestamp >= ? 
            GROUP BY activity_type
        """, (cutoff,))
        
        for row in self.cursor.fetchall():
            stats[row['activity_type']] = row['count']
        
        return stats


db = Database()
