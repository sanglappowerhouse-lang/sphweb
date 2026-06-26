import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import sessionmaker
from models import init_db, User, AdmissionsInquiry, FitnessQuery, UserRoutine, AnalyticsLog

def seed_database():
    print("Initializing database...")
    engine = init_db("sqlite:///drona_ai.db")
    Session = sessionmaker(bind=engine)
    session = Session()

    # Clear existing data to ensure fresh seeding
    session.query(AnalyticsLog).delete()
    session.query(UserRoutine).delete()
    session.query(FitnessQuery).delete()
    session.query(AdmissionsInquiry).delete()
    session.query(User).delete()
    session.commit()

    print("Seeding default users...")
    demo_users = ["fit_enthusiast", "trainer_bob", "anik_ghosh", "palash_golder", "guest_user"]
    for username in demo_users:
        user = User(id=username, created_at=datetime.utcnow() - timedelta(days=random.randint(1, 10)))
        session.add(user)
    session.commit()

    print("Seeding default admissions inquiries...")
    inquiry_types = ["Membership Info", "Admission Process", "Personal Training", "Facilities Query"]
    names = ["Rahul Sharma", "Sneha Paul", "Amit Das", "Priya Sen", "Vikram Singh", "Joydeep Roy", "Debjani Bose"]
    contacts = ["rahul@email.com", "+919876543210", "amit.das@outlook.com", "priya.sen@gmail.com", "9830012345", "joydeep@email.com", "debjani.b@yahoo.com"]
    messages = [
        "Interested in joining SPH Gym. Can you share details about the male section rules?",
        "Do you have separate timings or separate floors for women? Please confirm admission fees.",
        "Looking for a personal trainer on the ground floor. What is the fee structure?",
        "Are cardio equipments available on the first floor? When can I visit for a tour?",
        "Please call me regarding admission process for 3-month membership.",
        "Are there any discounts for couple memberships? Let me know.",
        "How can I register online? I am a beginner athlete."
    ]

    for i in range(15):
        # Generate timestamps spread over the last 7 days
        days_ago = random.randint(0, 6)
        hours_ago = random.randint(1, 23)
        ts = datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago)
        
        inquiry = AdmissionsInquiry(
            user_name=random.choice(names),
            contact_info=random.choice(contacts),
            inquiry_type=random.choice(inquiry_types),
            message=random.choice(messages),
            timestamp=ts
        )
        session.add(inquiry)
    session.commit()

    print("Seeding default fitness queries...")
    categories = ["Fitness", "Admissions", "Routine"]
    queries = [
        ("What is the difference between ground floor and first floor?", "Admissions"),
        ("Can you generate a beginner routine?", "Routine"),
        ("How much protein should I take daily?", "Fitness"),
        ("How to reduce belly fat in 30 days?", "Fitness"),
        ("What is the price of female membership?", "Admissions"),
        ("How do I perform a proper deadlift?", "Fitness"),
        ("Do you offer diet plans?", "Fitness"),
        ("How can I track my workout progress?", "Routine"),
        ("Is there parking space near SPH Gym?", "Admissions"),
        ("Show me the rules for gym floor conduct.", "Admissions"),
    ]

    for i in range(30):
        days_ago = random.randint(0, 6)
        hours_ago = random.randint(1, 23)
        ts = datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago)
        q_text, cat = random.choice(queries)
        
        fq = FitnessQuery(
            user_id=random.choice(demo_users),
            query_text=q_text,
            response_summary=f"Processed query about {q_text.split()[-1]} and provided response.",
            category=cat,
            timestamp=ts
        )
        session.add(fq)
    session.commit()

    print("Seeding default routines...")
    routines_templates = {
        "beginner": {
            "title": "Beginner Full-Body Transformation",
            "description": "A 3-day full-body routine designed to build foundational strength and familiarity with gym exercises.",
            "days": [
                {
                    "dayName": "Monday: Foundation Full Body",
                    "exercises": [
                        {"name": "Bodyweight Squats", "sets": 3, "reps": "12-15 reps", "done": False},
                        {"name": "Incline Push-Ups", "sets": 3, "reps": "8-10 reps", "done": False},
                        {"name": "Dumbbell Rows", "sets": 3, "reps": "10-12 reps", "done": False},
                        {"name": "Plank Hold", "sets": 3, "reps": "30-45 seconds", "done": False}
                    ]
                },
                {
                    "dayName": "Wednesday: Core & Cardio Core",
                    "exercises": [
                        {"name": "Treadmill Walk/Jog", "sets": 1, "reps": "15-20 mins", "done": False},
                        {"name": "Bicycle Crunches", "sets": 3, "reps": "15 reps/side", "done": False},
                        {"name": "Glute Bridges", "sets": 3, "reps": "12 reps", "done": False},
                        {"name": "Jumping Jacks", "sets": 3, "reps": "30 seconds", "done": False}
                    ]
                },
                {
                    "dayName": "Friday: Strength Focus",
                    "exercises": [
                        {"name": "Goblet Squats", "sets": 3, "reps": "10-12 reps", "done": False},
                        {"name": "Dumbbell Chest Press", "sets": 3, "reps": "10 reps", "done": False},
                        {"name": "Lat Pulldown", "sets": 3, "reps": "10-12 reps", "done": False},
                        {"name": "Russian Twists", "sets": 3, "reps": "15 reps/side", "done": False}
                    ]
                }
            ]
        },
        "intermediate": {
            "title": "Intermediate Push-Pull-Legs (PPL)",
            "description": "An intense 4-day training schedule focusing on specific muscle group splits.",
            "days": [
                {
                    "dayName": "Monday: Upper Body Push",
                    "exercises": [
                        {"name": "Flat Bench Press", "sets": 4, "reps": "8-10 reps", "done": False},
                        {"name": "Seated Dumbbell Shoulder Press", "sets": 3, "reps": "10-12 reps", "done": False},
                        {"name": "Incline Dumbbell Fly", "sets": 3, "reps": "12 reps", "done": False},
                        {"name": "Tricep Rope Pushdowns", "sets": 3, "reps": "12-15 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Tuesday: Upper Body Pull",
                    "exercises": [
                        {"name": "Pull-Ups / Lat Pulldown", "sets": 4, "reps": "8-12 reps", "done": False},
                        {"name": "Barbell Rows", "sets": 3, "reps": "10 reps", "done": False},
                        {"name": "Face Pulls (Shoulder Health)", "sets": 3, "reps": "15 reps", "done": False},
                        {"name": "Barbell Bicep Curls", "sets": 3, "reps": "10-12 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Thursday: Lower Body Legs",
                    "exercises": [
                        {"name": "Barbell Back Squats", "sets": 4, "reps": "8-10 reps", "done": False},
                        {"name": "Romanian Deadlifts", "sets": 3, "reps": "10 reps", "done": False},
                        {"name": "Leg Press", "sets": 3, "reps": "12 reps", "done": False},
                        {"name": "Standing Calf Raises", "sets": 4, "reps": "15 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Friday: Core & High-Intensity Cardio",
                    "exercises": [
                        {"name": "Hanging Leg Raises", "sets": 3, "reps": "12-15 reps", "done": False},
                        {"name": "Plank with Shoulder Taps", "sets": 3, "reps": "1 min", "done": False},
                        {"name": "HIIT Treadmill Sprints", "sets": 8, "reps": "30s sprint/30s rest", "done": False}
                    ]
                }
            ]
        },
        "advanced": {
            "title": "Advanced Hypertrophy & Power Split",
            "description": "5-day high volume muscle building and explosive power routine.",
            "days": [
                {
                    "dayName": "Monday: Chest & Biceps",
                    "exercises": [
                        {"name": "Incline Barbell Press", "sets": 4, "reps": "6-8 reps", "done": False},
                        {"name": "Weighted Dips", "sets": 3, "reps": "8-10 reps", "done": False},
                        {"name": "Cable Crossover", "sets": 3, "reps": "12-15 reps", "done": False},
                        {"name": "Incline Dumbbell Curl", "sets": 4, "reps": "10 reps", "done": False},
                        {"name": "Preacher Curl", "sets": 3, "reps": "12 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Tuesday: Back & Triceps",
                    "exercises": [
                        {"name": "Conventional Deadlifts", "sets": 4, "reps": "5 reps", "done": False},
                        {"name": "Weighted Pull-Ups", "sets": 3, "reps": "6-8 reps", "done": False},
                        {"name": "T-Bar Rows", "sets": 3, "reps": "10 reps", "done": False},
                        {"name": "Close Grip Bench Press", "sets": 3, "reps": "8-10 reps", "done": False},
                        {"name": "Overhead Tricep Extension", "sets": 3, "reps": "12 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Wednesday: Legs Quads Focus",
                    "exercises": [
                        {"name": "Front Squats", "sets": 4, "reps": "8 reps", "done": False},
                        {"name": "Walking Lunges", "sets": 3, "reps": "20 steps", "done": False},
                        {"name": "Leg Extensions", "sets": 4, "reps": "15 reps", "done": False},
                        {"name": "Seated Calf Raises", "sets": 4, "reps": "20 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Friday: Shoulders & Abs",
                    "exercises": [
                        {"name": "Military Press", "sets": 4, "reps": "6-8 reps", "done": False},
                        {"name": "Dumbbell Lateral Raises", "sets": 4, "reps": "12-15 reps", "done": False},
                        {"name": "Reverse Pec Deck", "sets": 3, "reps": "15 reps", "done": False},
                        {"name": "Ab Wheel Rollouts", "sets": 3, "reps": "12 reps", "done": False},
                        {"name": "Cable Crunches", "sets": 3, "reps": "15-20 reps", "done": False}
                    ]
                },
                {
                    "dayName": "Saturday: Legs Posterior Chain Focus",
                    "exercises": [
                        {"name": "Sumo Deadlifts", "sets": 3, "reps": "6-8 reps", "done": False},
                        {"name": "Lying Leg Curls", "sets": 4, "reps": "10-12 reps", "done": False},
                        {"name": "Glute-Ham Raises", "sets": 3, "reps": "10 reps", "done": False},
                        {"name": "Standing Calf Raises", "sets": 4, "reps": "15 reps", "done": False}
                    ]
                }
            ]
        }
    }

    # Seed User Routines
    for username in demo_users:
        if username == "guest_user":
            continue
        routine_type = random.choice(["beginner", "intermediate", "advanced"])
        plan = routines_templates[routine_type]
        
        # Mock some progress logs (dates checked)
        progress = {}
        today = datetime.utcnow().date()
        for offset in range(1, 5):
            log_date = str(today - timedelta(days=offset))
            # Mark some random exercises as complete
            progress[log_date] = [
                f"{plan['days'][0]['dayName']}_exercise_0",
                f"{plan['days'][0]['dayName']}_exercise_1"
            ]

        ur = UserRoutine(
            user_id=username,
            routine_type=routine_type,
            routine_plan=json.dumps(plan),
            progress_log=json.dumps(progress),
            last_updated=datetime.utcnow() - timedelta(days=random.randint(0, 3))
        )
        session.add(ur)
    session.commit()

    print("Seeding default analytics logs...")
    actions = [
        ("query", "Fitness query submitted: reducing fat"),
        ("query", "Admissions query submitted: male pricing"),
        ("routine_create", "Generated beginner fitness routine"),
        ("routine_log", "Completed exercises for Monday"),
        ("admission_submit", "Submitted contact form inquiry"),
        ("routine_create", "Generated advanced fitness routine"),
        ("query", "Fitness query submitted: protein intake"),
    ]

    for username in demo_users:
        for _ in range(random.randint(3, 10)):
            days_ago = random.randint(0, 6)
            hours_ago = random.randint(1, 23)
            ts = datetime.utcnow() - timedelta(days=days_ago, hours=hours_ago)
            act_type, detail = random.choice(actions)
            
            log = AnalyticsLog(
                user_id=username,
                action_type=act_type,
                action_detail=json.dumps({"detail": detail}),
                timestamp=ts
            )
            session.add(log)
    session.commit()

    print("Database seeded successfully with test records!")
    session.close()

if __name__ == "__main__":
    seed_database()
