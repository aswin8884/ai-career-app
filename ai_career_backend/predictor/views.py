from rest_framework.decorators import api_view
from rest_framework.response import Response
import pandas as pd
import joblib
import os
from django.conf import settings
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Securely Load Environment Variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# 2. Load the ML files into memory when the server starts
BASE_DIR = settings.BASE_DIR
model = joblib.load(os.path.join(BASE_DIR, 'random_forest_risk_model.pkl'))
model_columns = joblib.load(os.path.join(BASE_DIR, 'model_columns.pkl'))
recommender_df = pd.read_csv(os.path.join(BASE_DIR, 'accurate_recommender_data.csv'))

# --- ENDPOINT 1: ML PREDICTION & RECOMMENDATIONS ---
@api_view(['POST'])
def predict_risk_and_recommend(request):
    try:
        user_job = request.data.get('job_role')
        user_industry = request.data.get('industry')

        # Format input for the ML model
        input_df = pd.DataFrame([{'job_role': user_job, 'industry': user_industry}])
        input_encoded = pd.get_dummies(input_df)
        input_aligned = input_encoded.reindex(columns=model_columns, fill_value=0)

        # Make the ML Prediction
        predicted_risk = model.predict(input_aligned)[0]

        # Find safer jobs in the same industry
        better_jobs = recommender_df[
            (recommender_df['industry'] == user_industry) & 
            (recommender_df['job_role'] != user_job) & 
            (recommender_df['accurate_risk_percent'] < predicted_risk)
        ].sort_values(by='accurate_skill_growth', ascending=False).head(3)

        recommendations = better_jobs[['job_role', 'accurate_risk_percent', 'accurate_skill_growth']].to_dict(orient='records')

        # Auto-generate dynamic course links for each job
        for job in recommendations:
            url_friendly_job = job['job_role'].replace(' ', '+')
            job['coursera_link'] = f"https://www.coursera.org/search?query={url_friendly_job}+certification"
            job['youtube_link'] = f"https://www.youtube.com/results?search_query=how+to+become+a+{url_friendly_job}+full+course"

        return Response({
            "current_role": user_job,
            "industry": user_industry,
            "automation_risk_percent": round(predicted_risk, 2),
            "recommended_transitions": recommendations
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)

# --- ENDPOINT 2: GENERATIVE AI COACH ---
@api_view(['POST'])
def generate_coach_plan(request):
    try:
        current_role = request.data.get('current_role')
        target_role = request.data.get('target_role')
        
        if not GEMINI_API_KEY:
            return Response({"error": "API key not configured."}, status=500)

        # ✨ THE UPGRADED, WORLD-CLASS PROMPT
        prompt = f"""
        You are an elite Silicon Valley career coach. A user is currently a '{current_role}' and wants to transition into a safer, high-growth role as a '{target_role}'.
        
        Create a highly actionable, structured career transition roadmap for them. 
        Format your response strictly in Markdown using the exact headings below, and use bullet points and emojis for readability. 
        Do not write a long intro or outro. Get straight to the plan:

        ### 🚀 Phase 1: 1-Month Intensive (Foundations & Quick Wins)
        (Give 2-3 specific bullet points on what core skills to start learning immediately)

        ### 🏗️ Phase 2: 3-Month Plan (Building the Portfolio)
        (Give 2-3 specific bullet points on what projects to build or certifications to get)

        ### 🎯 Phase 3: 6-Month Plan (Job Hunt & Interview Prep)
        (Give 2-3 specific bullet points on networking, resume tweaking, and interview prep for this specific role)
        """
        
        # Call Google Gemini
        generative_model = genai.GenerativeModel('gemini-2.5-flash')
        response = generative_model.generate_content(prompt)
        
        return Response({"coach_plan": response.text})
        
    except Exception as e:
        print(f"🔥 GEMINI API ERROR: {str(e)}") 
        return Response({"error": str(e)}, status=400)