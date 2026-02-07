from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from emergentintegrations.llm.chat import LlmChat, UserMessage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Get Emergent LLM key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class GenerateRequest(BaseModel):
    fullName: str
    email: Optional[str] = ""
    phone: Optional[str] = ""
    location: Optional[str] = ""
    targetRole: str
    targetCompany: Optional[str] = ""
    yearsExperience: Optional[str] = ""
    currentRole: Optional[str] = ""
    currentCompany: Optional[str] = ""
    education: Optional[str] = ""
    skills: str
    achievements: Optional[str] = ""
    additionalInfo: Optional[str] = ""
    template: Optional[str] = "professional"

class Evaluation(BaseModel):
    overall: int
    relevance: int
    clarity: int
    professionalism: int
    roleAlignment: int

class ContentVersion(BaseModel):
    style: str
    resume: str
    coverLetter: str
    evaluation: Evaluation
    justification: str

class GenerateResponse(BaseModel):
    versions: List[ContentVersion]
    selectedVersion: int
    candidateName: str
    targetRole: str

class GenerationRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    candidateName: str
    targetRole: str
    versions: List[dict]
    selectedVersion: int
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Helper function to generate content using AI
async def generate_with_ai(request: GenerateRequest) -> GenerateResponse:
    """Generate resume and cover letter using GPT-4"""
    
    versions = []
    styles = [
        ("Professional & Formal", "formal, traditional, corporate"),
        ("Modern & Dynamic", "contemporary, energetic, innovative"),
        ("Concise & Impactful", "brief, powerful, results-focused")
    ]
    
    for style_name, style_desc in styles:
        # Create chat instance for this generation
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"resume-gen-{uuid.uuid4()}",
            system_message=f"""You are an expert resume writer and career coach. 
            Your writing style is {style_desc}.
            Generate professional, ATS-friendly content that highlights the candidate's strengths.
            Be specific and use action verbs. Quantify achievements when possible."""
        ).with_model("openai", "gpt-4")
        
        # Generate resume summary
        resume_prompt = f"""Create a professional resume summary for:
        
Name: {request.fullName}
Target Role: {request.targetRole}
{f'Target Company: {request.targetCompany}' if request.targetCompany else ''}
{f'Years of Experience: {request.yearsExperience}' if request.yearsExperience else ''}
{f'Current Role: {request.currentRole}' if request.currentRole else ''}
{f'Current Company: {request.currentCompany}' if request.currentCompany else ''}
{f'Education: {request.education}' if request.education else ''}
Key Skills: {request.skills}
{f'Key Achievements: {request.achievements}' if request.achievements else ''}
{f'Additional Info: {request.additionalInfo}' if request.additionalInfo else ''}

Write a compelling 3-4 sentence professional summary that:
1. Opens with a strong professional identity statement
2. Highlights relevant experience and expertise
3. Emphasizes key skills aligned with the target role
4. Includes quantifiable achievements if available

Style: {style_desc}

Return ONLY the resume summary text, no labels or explanations."""

        resume_message = UserMessage(text=resume_prompt)
        resume_text = await chat.send_message(resume_message)
        
        # Generate cover letter
        cover_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"cover-gen-{uuid.uuid4()}",
            system_message=f"""You are an expert cover letter writer.
            Your writing style is {style_desc}.
            Create compelling, personalized cover letters that connect the candidate's experience to the role."""
        ).with_model("openai", "gpt-4")
        
        cover_prompt = f"""Write a professional cover letter for:

Candidate: {request.fullName}
{f'Email: {request.email}' if request.email else ''}
{f'Phone: {request.phone}' if request.phone else ''}
{f'Location: {request.location}' if request.location else ''}

Applying for: {request.targetRole}
{f'At: {request.targetCompany}' if request.targetCompany else ''}

Background:
{f'- Current Role: {request.currentRole} at {request.currentCompany}' if request.currentRole else ''}
{f'- Experience: {request.yearsExperience}' if request.yearsExperience else ''}
{f'- Education: {request.education}' if request.education else ''}
- Skills: {request.skills}
{f'- Achievements: {request.achievements}' if request.achievements else ''}

Write a compelling 3-paragraph cover letter that:
1. Opens with enthusiasm for the specific role and company
2. Connects their experience and skills to the job requirements
3. Closes with a confident call to action

Style: {style_desc}

Return ONLY the cover letter text, starting with "Dear Hiring Manager," and ending with a professional closing."""

        cover_message = UserMessage(text=cover_prompt)
        cover_text = await cover_chat.send_message(cover_message)
        
        # Evaluate the generated content
        eval_chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"eval-{uuid.uuid4()}",
            system_message="""You are an expert career advisor and recruiter who evaluates resume and cover letter quality.
            Provide honest, constructive assessments."""
        ).with_model("openai", "gpt-4")
        
        eval_prompt = f"""Evaluate this resume summary and cover letter for a {request.targetRole} position.

RESUME SUMMARY:
{resume_text}

COVER LETTER:
{cover_text}

Rate each criterion from 0-100 and provide a brief justification:

1. Relevance (how well it matches the target role requirements)
2. Clarity (how clear and easy to understand the writing is)
3. Professionalism (how professional and polished it sounds)
4. Role Alignment (how well it positions the candidate for this specific role)

Also calculate an overall score (weighted average).

Respond in EXACTLY this format (numbers only, no % signs):
RELEVANCE: [score]
CLARITY: [score]
PROFESSIONALISM: [score]
ROLE_ALIGNMENT: [score]
OVERALL: [score]
JUSTIFICATION: [1-2 sentence explanation of why this version is effective or how it could be improved]"""

        eval_message = UserMessage(text=eval_prompt)
        eval_response = await eval_chat.send_message(eval_message)
        
        # Parse evaluation response
        eval_lines = eval_response.strip().split('\n')
        evaluation = {
            "relevance": 85,
            "clarity": 85,
            "professionalism": 85,
            "roleAlignment": 85,
            "overall": 85
        }
        justification = "This version effectively highlights your qualifications."
        
        for line in eval_lines:
            line = line.strip()
            if line.startswith("RELEVANCE:"):
                try:
                    evaluation["relevance"] = int(line.split(":")[1].strip().replace("%", ""))
                except:
                    pass
            elif line.startswith("CLARITY:"):
                try:
                    evaluation["clarity"] = int(line.split(":")[1].strip().replace("%", ""))
                except:
                    pass
            elif line.startswith("PROFESSIONALISM:"):
                try:
                    evaluation["professionalism"] = int(line.split(":")[1].strip().replace("%", ""))
                except:
                    pass
            elif line.startswith("ROLE_ALIGNMENT:"):
                try:
                    evaluation["roleAlignment"] = int(line.split(":")[1].strip().replace("%", ""))
                except:
                    pass
            elif line.startswith("OVERALL:"):
                try:
                    evaluation["overall"] = int(line.split(":")[1].strip().replace("%", ""))
                except:
                    pass
            elif line.startswith("JUSTIFICATION:"):
                justification = line.split(":", 1)[1].strip() if ":" in line else justification
        
        versions.append(ContentVersion(
            style=style_name,
            resume=resume_text.strip(),
            coverLetter=cover_text.strip(),
            evaluation=Evaluation(**evaluation),
            justification=justification
        ))
    
    # Select the best version based on overall score
    best_version_idx = max(range(len(versions)), key=lambda i: versions[i].evaluation.overall)
    
    return GenerateResponse(
        versions=versions,
        selectedVersion=best_version_idx,
        candidateName=request.fullName,
        targetRole=request.targetRole
    )

# Routes
@api_router.get("/")
async def root():
    return {"message": "Resume & Cover Letter Generator API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/generate", response_model=GenerateResponse)
async def generate_content(request: GenerateRequest):
    """Generate resume summary and cover letter with AI evaluation"""
    try:
        # Generate content using AI
        result = await generate_with_ai(request)
        
        # Save to database
        record = GenerationRecord(
            candidateName=result.candidateName,
            targetRole=result.targetRole,
            versions=[v.model_dump() for v in result.versions],
            selectedVersion=result.selectedVersion
        )
        doc = record.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.generations.insert_one(doc)
        
        return result
    except Exception as e:
        logging.error(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {str(e)}")

@api_router.get("/generations", response_model=List[GenerationRecord])
async def get_generations():
    """Get all previous generations"""
    generations = await db.generations.find({}, {"_id": 0}).to_list(100)
    for gen in generations:
        if isinstance(gen['timestamp'], str):
            gen['timestamp'] = datetime.fromisoformat(gen['timestamp'])
    return generations

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
