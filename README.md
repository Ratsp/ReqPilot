# ReqPilot AI

> An AI-powered requirement engineering platform that helps teams create, analyze, improve, compare, and manage software requirements from one workspace.

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Groq](https://img.shields.io/badge/AI-Groq-000000)](https://groq.com/)

---

## Overview

ReqPilot AI is a full-stack requirement engineering platform designed to improve the quality and clarity of software requirements.

Users can create requirements manually, upload documents for extraction, analyze requirements using AI, generate acceptance criteria and user stories, identify risks and gaps, track versions, compare requirements, and export requirement reports as PDFs.

The platform combines a React frontend, FastAPI backend, PostgreSQL database, Supabase authentication infrastructure, and Groq-powered AI operations.

---

## Problem Statement

Software projects often fail because requirements are unclear, incomplete, ambiguous, inconsistent, or poorly documented.

Teams commonly face problems such as:

* Missing functional or non-functional requirements
* Vague requirement descriptions
* No clear acceptance criteria
* Unidentified technical and business risks
* Difficulty tracking requirement changes
* Difficulty comparing multiple requirement versions
* Lack of traceability across requirement updates
* Time-consuming manual requirement analysis

ReqPilot AI helps solve these problems by providing AI-assisted requirement analysis and management in a centralized workspace.

---

## Key Features

### Requirement Management

* Create requirements manually
* View all saved requirements
* Edit requirement title, description, and status
* Delete requirements
* Search requirements by keyword
* Filter requirements by status
* Sort requirements by creation date, title, or version
* Paginate requirement listings
* View complete requirement details

### AI-Powered Requirement Analysis

* Analyze requirements and generate:

  * AI summary
  * Functional requirements
  * Non-functional requirements
  * Assumptions
  * Risks
* Generate a requirement quality report with:

  * Overall quality score
  * Strengths
  * Weaknesses
  * Recommendations
* Perform gap analysis to identify:

  * Missing information
  * Clarification questions
* Improve poorly written requirements
* Rewrite requirements into clearer and more structured formats
* Generate acceptance criteria
* Generate user stories
* Perform technical and business risk analysis
* Chat with an AI assistant about a specific requirement

### Requirement Intelligence

* Compare two requirements
* View requirement version history
* Track requirement traceability information
* Export requirement reports as PDF files
* Upload documents and extract requirements from supported files
* Dashboard with workspace-level requirement insights

### Dashboard Analytics

* Total requirements count
* Draft, pending, approved, and completed requirement counts
* Average quality score
* Recent activities
* Requirement status distribution
* Requirement trends
* Quality distribution insights

### Authentication and Security

* User registration
* User login
* JWT-based authentication
* Protected backend routes
* User-specific requirement access
* Environment-variable-based secret management
* CORS configuration for frontend-backend communication

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* React Router DOM
* Tailwind CSS
* Axios
* React Hot Toast
* Recharts

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* SQLAlchemy
* Psycopg
* Alembic
* Python-JOSE
* Passlib and Bcrypt
* Python Multipart

### Database and Authentication

* PostgreSQL
* Supabase
* JWT authentication

### AI and Document Processing

* Groq API
* LLM-powered requirement analysis
* PyMuPDF for PDF extraction
* Python DOCX for Word document extraction
* OpenPyXL for spreadsheet support
* Pytesseract for OCR support
* BeautifulSoup and Requests for webpage content extraction

### Deployment

* Backend: Render
* Frontend: Vercel
* Database: Supabase PostgreSQL

---

## System Architecture

```text
┌─────────────────────────────────────────────┐
│                React Frontend               │
│  React + TypeScript + Vite + Tailwind CSS   │
└──────────────────────┬──────────────────────┘
                       │
                       │ Axios HTTP Requests
                       │ JWT Authorization Header
                       ▼
┌─────────────────────────────────────────────┐
│                FastAPI Backend              │
│   Authentication + Requirement APIs + AI    │
└───────────────┬───────────────────┬─────────┘
                │                   │
                ▼                   ▼
┌─────────────────────────┐  ┌──────────────────┐
│   PostgreSQL Database   │  │    Groq AI API   │
│  Users + Requirements  │  │ Requirement AI   │
│  Versions + Activities │  │ Analysis Engine  │
└─────────────────────────┘  └──────────────────┘
```

---

## Project Structure

```text
ReqPilot/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   └── requirements.py
│   │   │
│   │   ├── middleware/
│   │   │   └── auth.py
│   │   │
│   │   ├── services/
│   │   │   ├── AI requirement analysis services
│   │   │   ├── document extraction services
│   │   │   └── PDF export services
│   │   │
│   │   ├── config.py
│   │   └── main.py
│   │
│   ├── sql/
│   │   └── database schema and SQL queries
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   └── requirement/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   └── requirements/
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   ├── dashboardService.ts
│   │   │   └── requirementService.ts
│   │   │
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

---

## API Endpoints

### Health

| Method | Endpoint  | Description          |
| ------ | --------- | -------------------- |
| GET    | `/health` | Check backend health |

### Authentication

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Register a new user            |
| POST   | `/auth/login`    | Login and receive JWT token    |
| GET    | `/auth/me`       | Get current authenticated user |

### Requirements

| Method | Endpoint                                      | Description                                    |
| ------ | --------------------------------------------- | ---------------------------------------------- |
| GET    | `/requirements`                               | Get all requirements                           |
| POST   | `/requirements`                               | Create a requirement                           |
| GET    | `/requirements/{requirement_id}`              | Get one requirement                            |
| PUT    | `/requirements/{requirement_id}`              | Update a requirement                           |
| DELETE | `/requirements/{requirement_id}`              | Delete a requirement                           |
| GET    | `/requirements/search`                        | Search requirements                            |
| GET    | `/requirements/filter/status`                 | Filter requirements by status                  |
| GET    | `/requirements/sort`                          | Sort requirements                              |
| GET    | `/requirements/paginate`                      | Paginate requirements                          |
| POST   | `/requirements/upload`                        | Upload and extract requirements from documents |
| POST   | `/requirements/webpage`                       | Analyze webpage content                        |
| GET    | `/requirements/{requirement_id}/export/pdf`   | Export requirement as PDF                      |
| GET    | `/requirements/{requirement_id}/versions`     | Get version history                            |
| GET    | `/requirements/{requirement_id}/traceability` | Get traceability information                   |
| POST   | `/requirements/compare`                       | Compare two requirements                       |

### AI Operations

| Method | Endpoint                                             | Description                    |
| ------ | ---------------------------------------------------- | ------------------------------ |
| POST   | `/requirements/{requirement_id}/analyze`             | Analyze requirement            |
| POST   | `/requirements/{requirement_id}/quality-analysis`    | Generate quality report        |
| POST   | `/requirements/{requirement_id}/gap-analysis`        | Identify requirement gaps      |
| POST   | `/requirements/{requirement_id}/improve`             | Improve requirement            |
| POST   | `/requirements/{requirement_id}/rewrite`             | Rewrite requirement            |
| POST   | `/requirements/{requirement_id}/acceptance-criteria` | Generate acceptance criteria   |
| POST   | `/requirements/{requirement_id}/user-stories`        | Generate user stories          |
| POST   | `/requirements/{requirement_id}/risk-analysis`       | Generate risk analysis         |
| POST   | `/requirements/{requirement_id}/chat`                | Chat with AI about requirement |

### Dashboard

| Method | Endpoint                          | Description              |
| ------ | --------------------------------- | ------------------------ |
| GET    | `/dashboard/stats`                | Get dashboard statistics |
| GET    | `/dashboard/recent-activities`    | Get recent activities    |
| GET    | `/dashboard/trends`               | Get requirement trends   |
| GET    | `/dashboard/quality-distribution` | Get quality distribution |

---

## Local Setup

### Prerequisites

Install the following before running the project:

* Python 3.10 or later
* Node.js 18 or later
* npm
* PostgreSQL database or Supabase project
* Groq API key

---

## Backend Setup

Move into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

Activate it on macOS or Linux:

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside the `backend` folder:

```env
DATABASE_URL=your_postgresql_connection_string

SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

JWT_SECRET=your_secure_jwt_secret
ACCESS_TOKEN_EXPIRE_MINUTES=60

GROQ_API_KEY=your_groq_api_key

FRONTEND_ORIGIN=http://localhost:5173
```

Run the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

Open FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

Move into the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

Run the frontend:

```bash
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## Environment Variables

### Backend

| Variable                      | Description                           |
| ----------------------------- | ------------------------------------- |
| `DATABASE_URL`                | PostgreSQL database connection string |
| `SUPABASE_URL`                | Supabase project URL                  |
| `SUPABASE_ANON_KEY`           | Supabase anonymous key                |
| `SUPABASE_SERVICE_ROLE_KEY`   | Supabase service role key             |
| `JWT_SECRET`                  | Secret used to sign JWT tokens        |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time             |
| `GROQ_API_KEY`                | Groq API key for AI operations        |
| `FRONTEND_ORIGIN`             | Allowed frontend origin for CORS      |

### Frontend

| Variable            | Description                     |
| ------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | Base URL of the FastAPI backend |

---

## Screenshots

Add screenshots after deployment.

```text
screenshots/
├── dashboard.png
├── requirement-list.png
├── requirement-details.png
├── ai-analysis.png
├── quality-report.png
├── risk-analysis.png
├── requirement-chat.png
└── compare-requirements.png
```

Example screenshot section:

```md
## Dashboard

<img width="959" height="476" alt="dash1" src="https://github.com/user-attachments/assets/08a9cb7a-2574-44b4-aa85-58b660eac86e" />
<img width="959" height="474" alt="dash2" src="https://github.com/user-attachments/assets/86873148-94e6-4219-a7b6-b11493d38496" />


## AI Requirement Analysis
<img width="959" height="475" alt="Req1" src="https://github.com/user-attachments/assets/3da6133b-6a79-45eb-b855-f446576049d5" />
<img width="959" height="473" alt="req2" src="https://github.com/user-attachments/assets/002e48ef-ce5c-40ab-86ab-3655d57514ba" />
<img width="958" height="473" alt="req3" src="https://github.com/user-attachments/assets/9e1d91c1-1b06-4b79-b2b5-c08973bfdc27" />
<img width="959" height="476" alt="req4" src="https://github.com/user-attachments/assets/8dd752a7-c235-4e46-851e-e26b43aa10d4" />


## Requirement Assistant

<img width="959" height="475" alt="ai1" src="https://github.com/user-attachments/assets/4c423fc5-5f5d-4784-b5c1-953f628a1a06" />

---

## Security Notes

* Never commit `.env` files to GitHub.
* Keep API keys, database URLs, JWT secrets, and Supabase service keys private.
* Use `.env.example` files with placeholder values only.
* Configure `FRONTEND_ORIGIN` with the deployed Vercel URL after deployment.
* Use a strong random value for `JWT_SECRET` in production.

Recommended `.gitignore` entries:

```gitignore
.env
.env.*
!.env.example

venv/
__pycache__/
*.pyc

node_modules/
dist/

uploads/
*.log
```

---

## Future Improvements

* Role-based access control for admin and team members
* Requirement collaboration and comments
* Requirement approval workflow
* Requirement dependency graph
* Advanced traceability matrix
* Export to DOCX and Excel
* Requirement templates
* Project and workspace management
* AI-generated test cases
* AI-generated API contracts
* Requirement prioritization using MoSCoW or RICE scoring
* Email notifications for requirement changes
* Real-time collaboration using WebSockets
* Improved webpage URL analysis support
* Docker containerization
* CI/CD pipeline with GitHub Actions

---

## Author

**Ratnali Pawar**

* GitHub: `[Ratnali A. P.](https://github.com/Ratsp)`
* LinkedIn: `[Ratnali Anil Pawar](https://www.linkedin.com/in/ratnali-anil-pawar-803904235/)`
