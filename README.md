# AI Career Path Predictor

AI Career Path Predictor is a full-stack intelligent career analysis platform that combines Machine Learning and Generative AI to evaluate job stability, detect skill gaps, and recommend safe technology transitions in a rapidly evolving market.

---

## Core Capabilities

- Job stability prediction using Scikit-Learn models
- AI-generated career transition roadmaps via Google Gemini
- Skill gap analysis with structured learning recommendations
- RESTful API architecture with Django
- Responsive modern frontend built with React and Tailwind CSS

---

## Architecture

Frontend (Vite + React) → Django REST API →  
Machine Learning Model (Scikit-Learn) + Gemini AI Integration

---

## Tech Stack

Frontend: React.js, Tailwind CSS, Axios  
Backend: Django REST Framework, Python 3.12  
ML/AI: Scikit-Learn, Pandas, NumPy, Google Gemini API  
Deployment: Vercel (Frontend), Render (Backend), GitHub Actions (CI/CD)

---

## Local Setup

Backend:
```bash
cd ai_career_backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

Environment variables:
```
GEMINI_API_KEY=your_key
VITE_API_URL=http://127.0.0.1:8000
```
