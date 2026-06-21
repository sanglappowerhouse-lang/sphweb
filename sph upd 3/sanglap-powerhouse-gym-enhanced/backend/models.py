from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(String(100), primary_key=True) # Usually username or session ID
    created_at = Column(DateTime, default=datetime.utcnow)
    
    routines = relationship("UserRoutine", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat()
        }

class AdmissionsInquiry(Base):
    __tablename__ = 'admissions_inquiries'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_name = Column(String(100), nullable=False)
    contact_info = Column(String(100), nullable=False)
    inquiry_type = Column(String(100), nullable=False)
    message = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_name": self.user_name,
            "contact_info": self.contact_info,
            "inquiry_type": self.inquiry_type,
            "message": self.message,
            "timestamp": self.timestamp.isoformat()
        }

class FitnessQuery(Base):
    __tablename__ = 'fitness_queries'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), nullable=True)
    query_text = Column(Text, nullable=False)
    response_summary = Column(Text, nullable=False)
    category = Column(String(50), default="Fitness")  # "Admissions", "Fitness", "Routine"
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "query_text": self.query_text,
            "response_summary": self.response_summary,
            "category": self.category,
            "timestamp": self.timestamp.isoformat()
        }

class UserRoutine(Base):
    __tablename__ = 'user_routines'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), ForeignKey('users.id'), nullable=False)
    routine_type = Column(String(50), nullable=False)  # "beginner", "intermediate", "advanced"
    routine_plan = Column(Text, nullable=False)        # JSON string of plan details
    progress_log = Column(Text, nullable=True)         # JSON string for tracking history
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="routines")

    def to_dict(self):
        import json
        return {
            "id": self.id,
            "user_id": self.user_id,
            "routine_type": self.routine_type,
            "routine_plan": json.loads(self.routine_plan) if self.routine_plan else {},
            "progress_log": json.loads(self.progress_log) if self.progress_log else {},
            "last_updated": self.last_updated.isoformat()
        }

class AnalyticsLog(Base):
    __tablename__ = 'analytics_logs'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(100), nullable=True)
    action_type = Column(String(100), nullable=False)  # e.g., "query", "routine_create", "routine_log", "admission_submit"
    action_detail = Column(Text, nullable=True)         # JSON or descriptive text
    timestamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "action_type": self.action_type,
            "action_detail": self.action_detail,
            "timestamp": self.timestamp.isoformat()
        }

def init_db(database_url="sqlite:///drona_ai.db"):
    engine = create_engine(database_url, connect_args={"check_same_thread": False} if "sqlite" in database_url else {})
    Base.metadata.create_all(engine)
    return engine
