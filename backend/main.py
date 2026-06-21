import os
import re
import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException, Depends, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker, Session
from dotenv import load_dotenv

from models import init_db, User, AdmissionsInquiry, FitnessQuery, UserRoutine, AnalyticsLog

# Load environment variables
load_dotenv()

# Database Setup
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///drona_ai.db")
engine = init_db(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Configure Google Gemini
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
gemini_available = False

if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        gemini_available = True
        print("Google Gemini API successfully configured.")
    except Exception as e:
        print(f"Failed to configure Gemini API: {e}")

# SPH Gym Knowledge Base Context for Gemini
SPH_GYM_CONTEXT = """
You are Drona AI, a helpful, highly professional fitness and admissions assistant for SPH Gym (Sanglap Power House Gym) in Madhyamgram, Kolkata (Pin: 700129).
Address: Vidyasagar Sarani, Madhyamgram, Kolkata - 700129.
Timings: Morning and Evening slots.
Facilities & Segregated Floors:
- SPH Gym spans two dedicated floors to provide separate facilities for male and female members.
- Ground Floor: Male members only. Includes premium strength training equipment, cardios, professional male trainers, and storage shelves.
- 1st Floor: Female members only. Includes full equipment suites, yoga, flexibility programs, professional female trainers, and storage shelves.
- Government Registration: W.B. Govt. Regn. No. 20025111780.

Membership Pricing & Plans:
- Male Membership: First Month (Admission + Fee) is ₹1500. Renewal from 2nd month is ₹500/month.
- Female Membership: First Month (Admission + Fee) is ₹1600. Renewal from 2nd month is ₹600/month.
- Personal Training (PT): ₹2000/month addon (available for both sections).
- Owner's Elite Personal Training (Dronacharya Package): ₹5000/session for exclusive 1-on-1 sessions directly with the founder & head trainer (15+ years experience, nutrition specialist, certified fitness coach).

Tone and Style:
- Be encouraging, modern, and direct. Use bullet points for plans and lists.
- Keep answers concise. Use relevant fitness emojis (💪, 🏋️, 🥗, ⏱️).
- Emphasize that separate floors ensure maximum comfort, privacy, and focused training.
- If asked to generate a workout routine, explain you can create a beginner, intermediate, or advanced plan and tell the user they can save/track it using the "Fitness Routine" and "Track Progress" tabs on their panel.
"""

# Initialize FastAPI App
app = FastAPI(title="SPH Gym Drona AI Backend", version="1.0.0")

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Enable CORS for external Vercel-hosted frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency for database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Rule-based local response fallback generator
def generate_local_response(query: str) -> str:
    q = query.lower()
    
    # Pricing/Fees Inquiry
    if any(x in q for x in ["price", "fee", "cost", "charge", "membership", "plan", "admission"]):
        return (
            "💪 Here is the SPH Gym Membership Pricing:\n\n"
            "♂️ **Male Section (Ground Floor):**\n"
            "- Admission + 1st Month: **₹1,500**\n"
            "- Monthly Renewal: **₹500 / month**\n\n"
            "♀️ **Female Section (1st Floor):**\n"
            "- Admission + 1st Month: **₹1,600**\n"
            "- Monthly Renewal: **₹600 / month**\n\n"
            "🏋️ **Personal Training (Add-on):**\n"
            "- Regular PT: **₹2,000 / month** (Includes 1-on-1 workouts & diet guidance)\n"
            "- Founder's Elite PT: **₹5,000 / session** (Direct 1-on-1 coaching with the founder)\n\n"
            "Would you like me to help you log a Membership Inquiry? Click the action button or ask me directly!"
        )
        
    # Facilities/Floors/Segregation
    if any(x in q for x in ["floor", "separate", "facility", "men", "women", "equipment", "ground", "first", "girl", "boy"]):
        return (
            "✨ SPH Gym is uniquely structured across two dedicated floors for maximum comfort and privacy:\n\n"
            "👉 **Ground Floor (Male Only):** Equipped with heavy strength machinery, cardio racks, and guided by professional male coaches.\n"
            "👉 **1st Floor (Female Only):** Complete equipment line, yoga & flexibility routines, guided exclusively by professional female trainers.\n\n"
            "This segregated layout ensures an optimal, hassle-free environment to crush your goals!"
        )
        
    # Timings/Location/Contact
    if any(x in q for x in ["time", "hour", "open", "address", "location", "where", "phone", "contact", "call", "whatsapp"]):
        return (
            "📍 **Location & Contact:**\n"
            "- **Address:** Vidyasagar Sarani, Madhyamgram, Kolkata - 700129\n"
            "- **Phone:** [+91 9836336565](tel:+919836336565) (Call) or [+91 6290 941 903](https://wa.me/916290941903) (WhatsApp)\n"
            "- **Map:** You can view SPH Gym on Google Maps via the link in our contact section.\n"
            "- **Hours:** We are open mornings and evenings. Please call us to confirm specific section slots!"
        )

    # Routine Generation
    if any(x in q for x in ["routine", "workout", "schedule", "exercise", "program", "plan"]):
        return (
            "🏋️ Let's get moving! I can generate a personalized workout routine for you. "
            "Please click on the **'Fitness Routine'** tab in my window to choose your training level "
            "(Beginner, Intermediate, or Advanced) and automatically generate your checklist. "
            "You can then check off exercises daily in the **'Track Progress'** tab!"
        )
        
    # Owner / Founder
    if any(x in q for x in ["owner", "founder", "head trainer", "coach", "dronacharya"]):
        return (
            "👑 SPH Gym's founder and head trainer has over 15 years of certified coaching experience "
            "and is a nutrition specialist who has transformed 500+ lives. "
            "Under the **Dronacharya Elite Program**, you can book 1-on-1 sessions directly with the founder (₹5,000/session) "
            "to fast-track your fitness progression!"
        )

    # General fitness/nutrition fallback
    return (
        "🤖 Hi! I'm **Drona AI**, your SPH Gym assistant. I can answer questions about:\n"
        "1. Membership pricing and admissions (type 'admission' or 'price')\n"
        "2. Gym facilities and floor layouts (type 'floors')\n"
        "3. Fitness workout plans (type 'workout')\n\n"
        "Please specify your query or tell me your fitness goal so I can help!"
    )

def query_gemini(user_query: str) -> str:
    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        full_prompt = f"{SPH_GYM_CONTEXT}\n\nUser Query: {user_query}\n\nResponse:"
        response = model.generate_content(full_prompt)
        return response.text
    except Exception as e:
        print(f"Error querying Gemini API: {e}. Falling back to rule-based response.")
        return generate_local_response(user_query)

def auto_categorize(query: str) -> str:
    q = query.lower()
    if any(x in q for x in ["price", "fee", "membership", "cost", "admission", "timing", "floor", "separate", "men", "women"]):
        return "Admissions"
    elif any(x in q for x in ["routine", "workout", "schedule", "exercise", "plan", "program", "split", "track"]):
        return "Routine"
    return "Fitness"

# Pydantic Schemas
class RegisterRequest(BaseModel):
    username: str

class ChatRequest(BaseModel):
    message: str
    username: Optional[str] = None

class MembershipRequest(BaseModel):
    user_name: str
    contact_info: str
    inquiry_type: Optional[str] = "Membership Info"
    message: Optional[str] = ""
    username: Optional[str] = ""

class RoutineSaveRequest(BaseModel):
    username: str
    routine_type: str = "beginner"
    routine_plan: Dict[str, Any]

class ProgressLogRequest(BaseModel):
    username: str
    date: str
    completed_exercises: List[str]

# API ENDPOINTS

@app.post("/api/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    username = req.username.strip()
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    
    # clean username
    username = re.sub(r'[^a-zA-Z0-9_]', '', username).lower()
    
    try:
        user = db.query(User).filter_by(id=username).first()
        if not user:
            user = User(id=username)
            db.add(user)
            
            # Log analytical log
            log = AnalyticsLog(
                user_id=username,
                action_type="register",
                action_detail=json.dumps({"detail": f"Registered user {username}"})
            )
            db.add(log)
            db.commit()
            status = "created"
        else:
            status = "found"
            
        return {"status": "success", "user": user.to_dict(), "auth_status": status}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chat")
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    message = req.message.strip()
    username = req.username.strip() if req.username else None
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
        
    category = auto_categorize(message)
    
    # Get response
    if gemini_available:
        response_text = query_gemini(message)
    else:
        response_text = generate_local_response(message)
        
    try:
        # Log query
        fq = FitnessQuery(
            user_id=username,
            query_text=message,
            response_summary=response_text[:300] + ("..." if len(response_text) > 300 else ""),
            category=category
        )
        db.add(fq)
        
        # Log analytics action
        log = AnalyticsLog(
            user_id=username,
            action_type="query",
            action_detail=json.dumps({"category": category, "query_length": len(message)})
        )
        db.add(log)
        db.commit()
        
        return {
            "response": response_text,
            "category": category,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/memberships")
@app.post("/api/admissions/inquiry")
def admissions_inquiry(req: MembershipRequest, db: Session = Depends(get_db)):
    user_name = req.user_name.strip()
    contact_info = req.contact_info.strip()
    inquiry_type = req.inquiry_type.strip() if req.inquiry_type else "Membership Info"
    message = req.message.strip() if req.message else ""
    username = req.username.strip() if req.username else None

    if not user_name or not contact_info:
        raise HTTPException(status_code=400, detail="Name and contact info are required")
        
    try:
        inquiry = AdmissionsInquiry(
            user_name=user_name,
            contact_info=contact_info,
            inquiry_type=inquiry_type,
            message=message
        )
        db.add(inquiry)
        
        log = AnalyticsLog(
            user_id=username,
            action_type="admission_submit",
            action_detail=json.dumps({"inquiry_type": inquiry_type})
        )
        db.add(log)
        db.commit()
        
        return {"status": "success", "message": "Inquiry successfully recorded!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/memberships")
def get_memberships(db: Session = Depends(get_db)):
    try:
        inquiries = db.query(AdmissionsInquiry).order_by(AdmissionsInquiry.timestamp.desc()).all()
        return [inq.to_dict() for inq in inquiries]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/routines")
def save_routine(req: RoutineSaveRequest, db: Session = Depends(get_db)):
    username = req.username.strip()
    routine_type = req.routine_type.strip()
    routine_plan = req.routine_plan
    
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not routine_plan:
        raise HTTPException(status_code=400, detail="Routine plan is required")
        
    try:
        # Check user exists
        user = db.query(User).filter_by(id=username).first()
        if not user:
            user = User(id=username)
            db.add(user)
            
        # Upsert routine
        routine = db.query(UserRoutine).filter_by(user_id=username).first()
        if not routine:
            routine = UserRoutine(
                user_id=username,
                routine_type=routine_type,
                routine_plan=json.dumps(routine_plan),
                progress_log=json.dumps({})
            )
            db.add(routine)
        else:
            routine.routine_type = routine_type
            routine.routine_plan = json.dumps(routine_plan)
            
        log = AnalyticsLog(
            user_id=username,
            action_type="routine_create",
            action_detail=json.dumps({"routine_type": routine_type})
        )
        db.add(log)
        db.commit()
        return {"status": "success", "message": "Routine plan saved!"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/routines")
def get_routine(username: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    username = username.strip()
    try:
        routine = db.query(UserRoutine).filter_by(user_id=username).first()
        if not routine:
            return {"status": "empty", "message": "No routine plan found. Let's create one!"}
            
        return {"status": "success", "routine": routine.to_dict()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/routines/progress")
def log_progress(req: ProgressLogRequest, db: Session = Depends(get_db)):
    username = req.username.strip()
    date_str = req.date.strip()  # YYYY-MM-DD
    completed_exercises = req.completed_exercises
    
    if not username:
        raise HTTPException(status_code=400, detail="Username is required")
    if not date_str:
        raise HTTPException(status_code=400, detail="Date is required")
        
    try:
        routine = db.query(UserRoutine).filter_by(user_id=username).first()
        if not routine:
            raise HTTPException(status_code=404, detail="No routine found for this user.")
            
        progress_dict = {}
        if routine.progress_log:
            try:
                progress_dict = json.loads(routine.progress_log)
            except:
                progress_dict = {}
                
        # Update progress for the date
        progress_dict[date_str] = completed_exercises
        routine.progress_log = json.dumps(progress_dict)
        
        log = AnalyticsLog(
            user_id=username,
            action_type="routine_log",
            action_detail=json.dumps({"date": date_str, "count": len(completed_exercises)})
        )
        db.add(log)
        db.commit()
        
        return {"status": "success", "progress_log": progress_dict}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/admin/summary")
def admin_summary(db: Session = Depends(get_db)):
    try:
        # Total counts
        users_count = db.query(func.count(User.id)).scalar() or 0
        inquiries_count = db.query(func.count(AdmissionsInquiry.id)).scalar() or 0
        queries_count = db.query(func.count(FitnessQuery.id)).scalar() or 0
        
        # Inquiries by type
        inquiry_types = db.query(
            AdmissionsInquiry.inquiry_type, func.count(AdmissionsInquiry.id)
        ).group_by(AdmissionsInquiry.inquiry_type).all()
        inquiry_types_dict = {t: c for t, c in inquiry_types}
        
        # Queries by category
        query_categories = db.query(
            FitnessQuery.category, func.count(FitnessQuery.id)
        ).group_by(FitnessQuery.category).all()
        query_categories_dict = {cat: c for cat, c in query_categories}
        
        # Activity trends over the last 7 days
        today = datetime.utcnow().date()
        inquiry_trends = {}
        query_trends = {}
        
        for i in range(7):
            d = today - timedelta(days=i)
            d_str = d.strftime("%Y-%m-%d")
            
            # Start and end datetimes for the day
            day_start = datetime.combine(d, datetime.min.time())
            day_end = datetime.combine(d, datetime.max.time())
            
            inq_cnt = db.query(func.count(AdmissionsInquiry.id)).filter(
                AdmissionsInquiry.timestamp.between(day_start, day_end)
            ).scalar() or 0
            inquiry_trends[d_str] = inq_cnt
            
            q_cnt = db.query(func.count(FitnessQuery.id)).filter(
                FitnessQuery.timestamp.between(day_start, day_end)
            ).scalar() or 0
            query_trends[d_str] = q_cnt
            
        # Routine completion rates
        routines = db.query(UserRoutine).all()
        routine_adherence = {"beginner": 0, "intermediate": 0, "advanced": 0}
        routine_counts = {"beginner": 0, "intermediate": 0, "advanced": 0}
        
        for r in routines:
            r_dict = r.to_dict()
            r_type = r_dict["routine_type"]
            plan = r_dict["routine_plan"]
            logs = r_dict["progress_log"]
            
            if r_type not in routine_adherence:
                continue
                
            routine_counts[r_type] += 1
            
            # calculate total exercises in plan
            total_exercises = 0
            for day in plan.get("days", []):
                total_exercises += len(day.get("exercises", []))
                
            if total_exercises == 0:
                continue
                
            # calculate total checked exercises in progress logs
            checked_count = 0
            log_days = len(logs)
            if log_days > 0:
                for date_key, exercises in logs.items():
                    checked_count += len(exercises)
                # Average completion rate
                completion_rate = min(100, int((checked_count / (total_exercises * log_days)) * 100))
                routine_adherence[r_type] += completion_rate
                
        # average adherence per type
        for t in routine_adherence:
            if routine_counts[t] > 0:
                routine_adherence[t] = int(routine_adherence[t] / routine_counts[t])
            else:
                routine_adherence[t] = 0
                
        # Recent inquiries
        recent_inquiries = db.query(AdmissionsInquiry).order_by(
            AdmissionsInquiry.timestamp.desc()
        ).limit(5).all()
        
        recent_inquiries_list = [inq.to_dict() for inq in recent_inquiries]
        
        return {
            "users_count": users_count,
            "inquiries_count": inquiries_count,
            "queries_count": queries_count,
            "inquiry_types": inquiry_types_dict,
            "query_categories": query_categories_dict,
            "inquiry_trends": inquiry_trends,
            "query_trends": query_trends,
            "routine_adherence": routine_adherence,
            "recent_inquiries": recent_inquiries_list
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Serve locally on port 8000
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
