# API Documentation

## Base URL

- **Development**: `http://localhost:8000`
- **Production**: `https://your-api.onrender.com`

## Authentication

Currently, the API does not require authentication (single-user mode).

---

## Endpoints

### 1. Chat Interface

#### Send Message

```http
POST /api/chat
```

Send a message to the AI agent and get a response.

**Request Body**:
```json
{
  "message": "Find Python developer jobs in Mumbai"
}
```

**Response**:
```json
{
  "agent": "JobSearch",
  "response": "🎯 I've found 8 real job opportunities in Mumbai!...",
  "data": [...],
  "reasoning": "User is searching for jobs",
  "jobs_found": 8
}
```

**Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Invalid message
- `500 Internal Server Error`: Server error

---

### 2. Job Management

#### Get All Jobs

```http
GET /api/jobs
```

Retrieve all saved jobs.

**Response**:
```json
[
  {
    "id": "job123",
    "title": "Python Developer",
    "company": "Tech Corp",
    "location": "Mumbai, India",
    "description": "...",
    "salary_range": "₹8-12 LPA",
    "requirements": ["Python", "Django", "REST API"],
    "status": "Active",
    "application_details": {
      "link": "https://company.com/careers/job123"
    }
  }
]
```

#### Apply to Job

```http
POST /api/jobs/{job_id}/apply
```

Mark a job as applied.

**Path Parameters**:
- `job_id` (string): Job identifier

**Response**:
```json
{
  "message": "Application status updated"
}
```

---

### 3. User Profile

#### Get Profile

```http
GET /api/profile
```

Get user profile information.

**Response**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Software Developer",
  "location": "Mumbai",
  "skills": ["Python", "React", "Node.js"],
  "preferences": {
    "preferred_location": "Mumbai",
    "preferred_role": "Full Stack Developer",
    "salary_min": "8 LPA",
    "salary_max": "15 LPA"
  }
}
```

#### Update Profile

```http
PUT /api/profile
```

Update user profile.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "Senior Developer",
  "location": "Mumbai",
  "skills": ["Python", "React", "AWS"],
  "preferences": {
    "preferred_location": "Remote",
    "salary_min": "12 LPA"
  }
}
```

**Response**:
```json
{
  "message": "Profile updated successfully"
}
```

---

### 4. Resume Analysis

#### Upload Resume

```http
POST /api/resume/upload
```

Upload and analyze a resume (PDF only).

**Content-Type**: `multipart/form-data`

**Form Data**:
- `file`: PDF file (max 10MB)

**Response**:
```json
{
  "score": 85,
  "feedback": [
    "Strong technical skills section",
    "Add more quantifiable achievements",
    "Include links to projects"
  ],
  "timestamp": "2025-11-25T20:00:00Z"
}
```

#### Get Latest Resume Review

```http
GET /api/resume
```

Get the most recent resume analysis.

**Response**: Same as upload response

---

### 5. Skill Tests

#### Get All Tests

```http
GET /api/tests
```

Retrieve all available skill tests.

**Response**:
```json
[
  {
    "id": "test123",
    "skill_name": "Python",
    "difficulty": "intermediate",
    "question_count": 5,
    "created_at": "2025-11-25T15:00:00Z"
  }
]
```

#### Get Specific Test

```http
GET /api/tests/{test_id}
```

Get a test with questions.

**Path Parameters**:
- `test_id` (string): Test identifier

**Response**:
```json
{
  "id": "test123",
  "skill_name": "Python",
  "difficulty": "intermediate",
  "questions": [
    {
      "id": 1,
      "question": "What is a decorator in Python?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "A",
      "explanation": "..."
    }
  ],
  "created_at": "2025-11-25T15:00:00Z",
  "job_related_ids": ["job123", "job456"]
}
```

#### Submit Test

```http
POST /api/tests/{test_id}/submit
```

Submit test answers and get results.

**Request Body**:
```json
{
  "answers": {
    "1": "Option A",
    "2": "Option C",
    "3": "Option B"
  },
  "time_taken": 300
}
```

**Response**:
```json
{
  "score": 4,
  "total": 5,
  "percentage": 80.0,
  "feedback": [
    {
      "question_id": "1",
      "question": "What is a decorator?",
      "user_answer": "Option A",
      "correct_answer": "Option A",
      "is_correct": true,
      "explanation": "..."
    }
  ]
}
```

#### Get Test Results

```http
GET /api/tests/results
```

Get all test results for the user.

**Response**:
```json
[
  {
    "id": 1,
    "test_id": "test123",
    "score": 4,
    "total_questions": 5,
    "percentage": 80.0,
    "taken_at": "2025-11-25T16:00:00Z",
    "time_taken_seconds": 300
  }
]
```

---

### 6. Learning Paths

#### Get All Learning Paths

```http
GET /api/learning/all
```

Retrieve all learning paths.

**Response**:
```json
[
  {
    "id": 1,
    "data": {
      "skill": "React",
      "duration_weeks": 4,
      "milestones": [...],
      "recommendations": [
        {
          "skill": "React",
          "resource": "https://react.dev",
          "type": "Documentation"
        }
      ]
    },
    "timestamp": "2025-11-25T14:00:00Z"
  }
]
```

---

### 7. Dashboard

#### Get Dashboard Stats

```http
GET /api/dashboard
```

Get user dashboard statistics.

**Response**:
```json
{
  "total_jobs": 15,
  "jobs_applied": 5,
  "active_learning_paths": 3,
  "resume_score": 85,
  "recent_activity": [
    "Found job: Python Developer",
    "Resume reviewed: Score 85"
  ],
  "application_history": [
    {"name": "Mon", "jobs": 2},
    {"name": "Tue", "jobs": 1},
    {"name": "Wed", "jobs": 3}
  ]
}
```

---

### 8. User Activity

#### Get Activity

```http
GET /api/activity
```

Get recent user activity and statistics.

**Response**:
```json
{
  "recent": [
    {
      "type": "job_search",
      "data": {"query": "Python jobs", "results_count": 8},
      "timestamp": "2025-11-25T16:00:00Z"
    }
  ],
  "stats": {
    "job_search": 5,
    "test_taken": 2,
    "learning_started": 3
  }
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request format"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

---

## Rate Limiting

Currently, there are no rate limits. For production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per user

---

## CORS Policy

- **Development**: Allows all origins (`*`)
- **Production**: Set `FRONTEND_URL` environment variable

---

## Data Models

### JobPosting

```typescript
{
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_range: string;
  requirements: string[];
  status: "Active" | "Applied";
  application_details: {
    link?: string;
    applied_date?: string;
    status?: string;
  };
}
```

### UserProfile

```typescript
{
  name: string;
  email: string;
  role: string;
  location: string;
  skills: string[];
  preferences: {
    preferred_location: string;
    preferred_role: string;
    salary_min: string;
    salary_max: string;
  };
}
```

### SkillTest

```typescript
{
  id: string;
  skill_name: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  questions: Question[];
  created_at: string;
  job_related_ids: string[];
}
```

### Question

```typescript
{
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}
```

---

## WebSocket Support (Future)

Currently, all communication is via REST API. WebSocket support for real-time chat is planned for future versions.

---

## Pagination (Future)

Currently, all endpoints return full datasets. Pagination will be added for:
- `/api/jobs` - Job listings
- `/api/tests/results` - Test history
- `/api/activity` - User activity

Format:
```http
GET /api/jobs?page=1&limit=20
```

---

**Last Updated**: 2025-11-25
**Version**: 1.0.0
