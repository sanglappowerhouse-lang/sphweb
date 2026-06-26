import unittest
import json
from app import app, Session, engine
from models import Base

class TestDronaAIBackend(unittest.TestCase):
    
    @classmethod
    def setUpClass(cls):
        # Configure app to use testing database or local sqlite test db
        app.config['TESTING'] = True
        cls.client = app.test_client()

    def setUp(self):
        # Create a clean database structure for each test
        Base.metadata.create_all(engine)
        self.session = Session()

    def tearDown(self):
        self.session.close()
        # Drop all tables after test
        Base.metadata.drop_all(engine)

    def test_user_registration(self):
        # Test registering a new user
        response = self.client.post('/api/auth/register', json={"username": "test_athlete_123"})
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "success")
        self.assertEqual(data["user"]["id"], "test_athlete_123")

        # Test registering with empty name
        response_empty = self.client.post('/api/auth/register', json={"username": ""})
        self.assertEqual(response_empty.status_code, 400)

    def test_admissions_inquiry(self):
        # Test submitting a new admissions contact inquiry
        response = self.client.post('/api/admissions/inquiry', json={
            "user_name": "Rohan Das",
            "contact_info": "+919876543210",
            "inquiry_type": "Membership Info",
            "message": "Testing message info registration.",
            "username": "test_athlete"
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data["status"], "success")

    def test_chat_endpoint(self):
        # Test chat messages
        response = self.client.post('/api/chat', json={
            "message": "how much is the fee for male membership?",
            "username": "test_athlete"
        })
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIn("response", data)
        self.assertEqual(data["category"], "Admissions")

    def test_routines_management(self):
        # Register user first
        self.client.post('/api/auth/register', json={"username": "tester"})

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
        
        save_response = self.client.post('/api/routines', json={
            "username": "tester",
            "routine_type": "beginner",
            "routine_plan": plan
        })
        self.assertEqual(save_response.status_code, 200)
        
        # Get routine
        get_response = self.client.get('/api/routines?username=tester')
        self.assertEqual(get_response.status_code, 200)
        get_data = json.loads(get_response.data)
        self.assertEqual(get_data["status"], "success")
        self.assertEqual(get_data["routine"]["routine_type"], "beginner")
        self.assertEqual(get_data["routine"]["routine_plan"]["title"], "Test Plan")

    def test_progress_tracking(self):
        # Create user & routine
        self.client.post('/api/auth/register', json={"username": "tracker_user"})
        plan = {
            "title": "Test Plan",
            "days": [
                {
                    "dayName": "Monday",
                    "exercises": [{"name": "Pushups", "sets": 3, "reps": "10", "done": False}]
                }
            ]
        }
        self.client.post('/api/routines', json={
            "username": "tracker_user",
            "routine_type": "beginner",
            "routine_plan": plan
        })

        # Save progress log
        progress_response = self.client.post('/api/routines/progress', json={
            "username": "tracker_user",
            "date": "2026-06-12",
            "completed_exercises": ["Monday_exercise_0"]
        })
        self.assertEqual(progress_response.status_code, 200)
        progress_data = json.loads(progress_response.data)
        self.assertEqual(progress_data["status"], "success")
        self.assertIn("2026-06-12", progress_data["progress_log"])
        self.assertEqual(progress_data["progress_log"]["2026-06-12"], ["Monday_exercise_0"])

    def test_admin_summary(self):
        # Create some seed data via API
        self.client.post('/api/auth/register', json={"username": "admin_test"})
        self.client.post('/api/admissions/inquiry', json={
            "user_name": "Test User",
            "contact_info": "test@gmail.com",
            "inquiry_type": "Membership Info",
            "username": "admin_test"
        })
        self.client.post('/api/chat', json={
            "message": "testing routine generator",
            "username": "admin_test"
        })

        # Query summary
        response = self.client.get('/api/admin/summary')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        
        self.assertGreaterEqual(data["users_count"], 1)
        self.assertGreaterEqual(data["inquiries_count"], 1)
        self.assertGreaterEqual(data["queries_count"], 1)

if __name__ == '__main__':
    unittest.main()
