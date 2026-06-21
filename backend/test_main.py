import pytest
import json
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from main import app, get_db
from models import Base

# Set up test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_drona_ai.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override database dependency in FastAPI app
def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

# Initialize TestClient
client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    # Create tables before each test
    Base.metadata.create_all(bind=engine)
    yield
    # Drop tables after each test
    Base.metadata.drop_all(bind=engine)

def test_user_registration():
    # Test registering a new user
    response = client.post("/api/auth/register", json={"username": "test_athlete_123"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["user"]["id"] == "test_athlete_123"

    # Test registering with empty name
    response_empty = client.post("/api/auth/register", json={"username": ""})
    assert response_empty.status_code == 400

def test_admissions_inquiry_compat():
    # Test submitting a new admissions contact inquiry (backward compatibility alias)
    response = client.post("/api/admissions/inquiry", json={
        "user_name": "Rohan Das",
        "contact_info": "+919876543210",
        "inquiry_type": "Membership Info",
        "message": "Testing message info registration.",
        "username": "test_athlete"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"

def test_memberships_endpoint():
    # Test POSTing a new membership inquiry to the new endpoint
    post_response = client.post("/api/memberships", json={
        "user_name": "Karan Sharma",
        "contact_info": "karan@gmail.com",
        "inquiry_type": "Personal Training",
        "message": "Interested in 1-on-1 PT.",
        "username": "karan_sharma"
    })
    assert post_response.status_code == 200
    post_data = post_response.json()
    assert post_data["status"] == "success"

    # Test GETting memberships
    get_response = client.get("/api/memberships")
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert len(get_data) == 1
    assert get_data[0]["user_name"] == "Karan Sharma"
    assert get_data[0]["contact_info"] == "karan@gmail.com"
    assert get_data[0]["inquiry_type"] == "Personal Training"

def test_chat_endpoint():
    # Test chat messages and automatic category classification
    response = client.post("/api/chat", json={
        "message": "how much is the fee for male membership?",
        "username": "test_athlete"
    })
    assert response.status_code == 200
    data = response.json()
    assert "response" in data
    assert data["category"] == "Admissions"

def test_routines_management():
    # Register user first
    client.post("/api/auth/register", json={"username": "tester"})

    # Save a routine
    plan = {
        "title": "Test Plan",
        "description": "Desc",
        "days": [
            {
                "dayName": "Monday",
                "exercises": [{"name": "Pushups", "sets": 3, "reps": "10", "done": False}]
            }
        ]
    }
    
    save_response = client.post("/api/routines", json={
        "username": "tester",
        "routine_type": "beginner",
        "routine_plan": plan
    })
    assert save_response.status_code == 200
    
    # Get routine
    get_response = client.get("/api/routines?username=tester")
    assert get_response.status_code == 200
    get_data = get_response.json()
    assert get_data["status"] == "success"
    assert get_data["routine"]["routine_type"] == "beginner"
    assert get_data["routine"]["routine_plan"]["title"] == "Test Plan"

def test_progress_tracking():
    # Create user & routine
    client.post("/api/auth/register", json={"username": "tracker_user"})
    plan = {
        "title": "Test Plan",
        "days": [
            {
                "dayName": "Monday",
                "exercises": [{"name": "Pushups", "sets": 3, "reps": "10", "done": False}]
            }
        ]
    }
    client.post("/api/routines", json={
        "username": "tracker_user",
        "routine_type": "beginner",
        "routine_plan": plan
    })

    # Save progress log
    progress_response = client.post("/api/routines/progress", json={
        "username": "tracker_user",
        "date": "2026-06-12",
        "completed_exercises": ["Monday_exercise_0"]
    })
    response_data = progress_response.json()
    assert response_data
    assert progress_response.status_code == 200
    assert response_data["status"] == "success"
    assert "2026-06-12" in response_data["progress_log"]
    assert response_data["progress_log"]["2026-06-12"] == ["Monday_exercise_0"]

def test_admin_summary():
    # Create some seed data via API
    client.post("/api/auth/register", json={"username": "admin_test"})
    client.post("/api/memberships", json={
        "user_name": "Test User",
        "contact_info": "test@gmail.com",
        "inquiry_type": "Membership Info",
        "username": "admin_test"
    })
    client.post("/api/chat", json={
        "message": "testing routine generator",
        "username": "admin_test"
    })

    # Query summary
    response = client.get("/api/admin/summary")
    assert response.status_code == 200
    data = response.json()
    
    assert data["users_count"] >= 1
    assert data["inquiries_count"] >= 1
    assert data["queries_count"] >= 1
