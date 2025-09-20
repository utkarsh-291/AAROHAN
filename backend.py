# backend.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import google.generativeai as genai
import time

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# --- ADD THIS DEBUG LINE ---
print(f"✅ Server starting... API Key Loaded: {GOOGLE_API_KEY}")
# -------------------------

# Configure the Gemini API client
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

app = FastAPI()

# CORS Middleware to allow connections from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8080", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserMessage(BaseModel):
    message: str

# Lightweight fallback generator (no logging)
def fallback_response(message: str) -> str:
    m = message.lower()
    if any(x in m for x in ["exam", "test", "study", "revision"]):
        return ("I get that exams are stressful. Try a short breathing break, "
                "then break tasks into 25-minute chunks. Want a simple study plan?")
    if any(x in m for x in ["anxiety", "panic", "panic attack", "anxious"]):
        return ("If you're anxious, try grounding: 5 things you can see, 4 you can touch, "
                "3 you can hear, 2 you can smell, 1 you can taste. If it's severe, contact a counselor.")
    if any(x in m for x in ["suicide", "kill myself", "self harm"]):
        return ("If you are in immediate danger, please call local emergency services right now. "
                "If you are in India, dial 112. You're not alone.")
    return ("Sorry, I can't access the AI right now. Try rephrasing or ask for a relaxation technique.")

@app.post("/chat")
async def chat(user: UserMessage):
    if not GOOGLE_API_KEY:
        return {"response": fallback_response(user.message), "source": "fallback"}

    # --- NEW: Exponential Backoff Logic ---
    max_retries = 3
    base_delay = 1  # in seconds
    for attempt in range(max_retries):
        try:
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = (
                "You are a concise, empathetic student mental-health assistant. "
                "Keep answers short, supportive, and suggest actionable next steps. "
                "If a user expresses self-harm, advise them to seek immediate help and give emergency contact info. "
                f"\n\nUser: {user.message}\nAssistant:"
            )
            resp = model.generate_content(prompt)
            text = resp.text.strip()
            # If successful, return the response immediately
            return {"response": text, "source": "ai"}
        
        except Exception as e:
            # Check if the error is a rate limit error (often code 429)
            if "429" in str(e):
                print(f"Rate limit hit. Retrying in {base_delay}s... (Attempt {attempt + 1}/{max_retries})")
                time.sleep(base_delay)
                base_delay *= 2  # Double the delay for the next attempt
            else:
                # If it's a different error, don't retry, just fail gracefully
                print(f"An unexpected error occurred with the Gemini API: {e}")
                return {"response": fallback_response(user.message), "source": "fallback"}

    # If all retries fail, return the fallback response
    print("All retries failed. Returning fallback response.")
    return {"response": fallback_response(user.message), "source": "fallback"}