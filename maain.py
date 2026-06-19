from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv
import os

# Load .env file
load_dotenv()

# Create FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq Client
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

# Request model
class QuestionRequest(BaseModel):
    question: str

# Home route
@app.get("/")
def home():
    return {"message": "AI Study Assistant API Running"}

# Ask AI route
@app.post("/ask")
def ask_question(request: QuestionRequest):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI Study Assistant."
            },
            {
                "role": "user",
                "content": request.question
            }
        ]
    )

    answer = response.choices[0].message.content

    return {"answer": answer}