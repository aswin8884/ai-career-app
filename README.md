# AI Career Path Predictor

A web app that predicts career-path stability from a user's profile and generates
personalised, AI-written guidance. It combines a trained classification model with
a large language model: the model scores the outcome, and the LLM explains it in
natural language.

**🔗 Live demo:** _[add your deployment URL here]_


[AI Career Path Predictor](images/ai_career_img1.png)
[AI Career Path Predictor](images/ai_career_img2.png)
[AI Career Path Predictor](images/ai_career_img3.png)

---

## What it does

- Takes a user's profile / career-related inputs
- Uses a **scikit-learn classification model** to predict a career-stability outcome
- Passes the result to the **Google Gemini API**, which generates tailored,
  human-readable recommendations
- Presents everything through a clean React interface

The interesting part is the **hybrid design**: a classical ML model for the
prediction, plus an LLM for the explanation — so users get both a data-driven
result and an understandable narrative.

---

## How it works

```
User profile
     │
     ▼
React frontend ──► Django REST backend
                        │
          ┌─────────────┴─────────────┐
          ▼                           ▼
  scikit-learn model            Google Gemini API
  (predicts outcome)      (generates explanation from result)
          │                           │
          └─────────────┬─────────────┘
                        ▼
              Combined response to UI
```

---

## Tech stack

**ML:** Python · scikit-learn · Pandas
**Generative AI:** Google Gemini API
**Backend:** Django · Django REST Framework
**Frontend:** React · Vite
**Deployment:** Vercel

---

## Key engineering decisions

- **Hybrid ML + LLM design** — the classifier makes the prediction; the LLM only
  explains it, keeping the prediction grounded in the model rather than the LLM's
  guesswork
- **Django REST backend** to serve both the model output and the LLM-generated text
  through a clean API
- **Prompt design** so Gemini explains the specific predicted outcome rather than
  giving generic advice

---

## Running locally

```bash
# Backend
cd backend
pip install -r requirements.txt
python manage.py runserver

# Frontend
cd frontend
npm install
npm run dev
```

Add your Gemini API key to a `.env` file:

```
GEMINI_API_KEY=your_key_here
```

---

## About

Built as a self-directed project to explore combining classical machine learning
with generative AI in one product. Developed alongside my M.Sc. in Computer Science
(E-Government) at the University of Koblenz.

> Developed with AI assistance during implementation; I understand and can explain
> every part of the codebase.

**Author:** Aswin Pulickal Binduraj · [LinkedIn](https://linkedin.com/in/aswin-pulickal) · [GitHub](https://github.com/aswin8884)
