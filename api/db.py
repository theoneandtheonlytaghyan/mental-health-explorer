import sqlite3
import os
import tempfile

# Use /tmp for Vercel serverless compatibility
DB_DIR = os.path.join(tempfile.gettempdir(), "mental_health_explorer_db")
DB_PATH = os.path.join(DB_DIR, "app.db")

def _get_db():
    """Get or create database connection."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL")
    conn.execute("PRAGMA foreign_keys=ON")
    return conn

def init_db():
    """Initialize database tables."""
    conn = _get_db()
    try:
        # survey_data: id, gender, country, treatment, work_interference, etc.
        conn.execute("""
            CREATE TABLE IF NOT EXISTS survey_data (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gender TEXT,
                country TEXT,
                treatment TEXT,
                work_interference TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # social_media_insights: id, text, primary_concern, severity, safety_concerns
        conn.execute("""
            CREATE TABLE IF NOT EXISTS social_media_insights (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                text TEXT,
                primary_concern TEXT,
                severity TEXT,
                safety_concerns BOOLEAN,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        # feedback: id, user_id, feedback_type, content, rating
        conn.execute("""
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                feedback_type TEXT,
                content TEXT,
                rating INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
    finally:
        conn.close()

def seed_data_if_empty():
    """Seed database with initial data if empty."""
    conn = _get_db()
    try:
        count = conn.execute("SELECT COUNT(*) FROM survey_data").fetchone()[0]
        if count == 0:
            print("[BACKEND_STEP] Seeding database with initial survey data")
            survey_samples = [
                ("Male", "United States", "Yes", "Often"),
                ("Female", "Canada", "No", "Rarely"),
                ("Male", "United Kingdom", "Yes", "Sometimes"),
                ("Female", "United States", "Yes", "Never"),
                ("Non-binary", "Germany", "No", "Often"),
                ("Female", "Australia", "Yes", "Sometimes"),
                ("Male", "United States", "No", "Rarely"),
                ("Male", "United States", "Yes", "Often"),
                ("Female", "France", "No", "Never"),
                ("Male", "India", "Yes", "Sometimes"),
            ] * 10 # 100 samples
            conn.executemany(
                "INSERT INTO survey_data (gender, country, treatment, work_interference) VALUES (?, ?, ?, ?)",
                survey_samples
            )
            
            social_samples = [
                ("Feeling really overwhelmed with work lately. The deadlines are non-stop.", "Anxiety", "Moderate", 0),
                ("I just feel so tired all the time, even when I sleep 8 hours.", "Depression", "Mild", 0),
                ("Having trouble focusing on anything for more than 5 minutes.", "ADHD symptoms", "Moderate", 0),
                ("Sometimes I wonder if it's all worth it. Everything is so heavy.", "Depression", "High", 1),
            ] * 5
            conn.executemany(
                "INSERT INTO social_media_insights (text, primary_concern, severity, safety_concerns) VALUES (?, ?, ?, ?)",
                social_samples
            )
            conn.commit()
    finally:
        conn.close()

# Initialize database on module import
init_db()
seed_data_if_empty()
