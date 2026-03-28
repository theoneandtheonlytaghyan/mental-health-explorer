import json
from .db import _get_db
from .services import analyze_text_ai, get_survey_stats_logic, get_survey_distributions_logic

def get_survey_stats():
    """Aggregates workplace survey data for KPIs."""
    print("[BACKEND_START] get_survey_stats called")
    try:
        result = get_survey_stats_logic()
        print(f"[BACKEND_SUCCESS] get_survey_stats complete result={result}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_survey_stats failed: {e}")
        raise

def get_survey_distributions():
    """Distribution data for charts (e.g., gender, country, treatment)."""
    print("[BACKEND_START] get_survey_distributions called")
    try:
        result = get_survey_distributions_logic()
        print(f"[BACKEND_SUCCESS] get_survey_distributions complete result_len={len(result)}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_survey_distributions failed: {e}")
        raise

def get_social_media_analysis(limit: int = 100):
    """Retrieves AI-analyzed social media posts."""
    print(f"[BACKEND_START] get_social_media_analysis called limit={limit}")
    conn = _get_db()
    try:
        rows = conn.execute("SELECT text, primary_concern, severity, safety_concerns FROM social_media_insights LIMIT ?", (limit,)).fetchall()
        result = [dict(r) for r in rows]
        print(f"[BACKEND_SUCCESS] get_social_media_analysis complete result_len={len(result)}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_social_media_analysis failed: {e}")
        raise
    finally:
        conn.close()

def analyze_text(text: str):
    """Performs real-time AI analysis on user-provided text."""
    print(f"[BACKEND_START] analyze_text called text_len={len(text)}")
    try:
        result = analyze_text_ai(text)
        print(f"[BACKEND_SUCCESS] analyze_text complete result={result}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] analyze_text failed: {e}")
        raise

def submit_feedback(user_id: str, feedback_type: str, content: str, rating: int):
    """Saves user feedback to the database."""
    print(f"[BACKEND_START] submit_feedback called user_id={user_id}, type={feedback_type}, rating={rating}")
    conn = _get_db()
    try:
        cursor = conn.execute(
            "INSERT INTO feedback (user_id, feedback_type, content, rating) VALUES (?, ?, ?, ?)",
            (user_id, feedback_type, content, rating)
        )
        conn.commit()
        item_id = cursor.lastrowid
        print(f"[BACKEND_SUCCESS] submit_feedback complete id={item_id}")
        return {"id": item_id, "status": "success"}
    except Exception as e:
        print(f"[BACKEND_ERROR] submit_feedback failed: {e}")
        raise
    finally:
        conn.close()

def get_feedback_logs():
    """Retrieves all submitted feedback."""
    print("[BACKEND_START] get_feedback_logs called")
    conn = _get_db()
    try:
        rows = conn.execute("SELECT id, feedback_type, content, rating, created_at FROM feedback ORDER BY created_at DESC").fetchall()
        result = [dict(r) for r in rows]
        print(f"[BACKEND_SUCCESS] get_feedback_logs complete result_len={len(result)}")
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] get_feedback_logs failed: {e}")
        raise
    finally:
        conn.close()

__all__ = ["get_survey_stats", "get_survey_distributions", "get_social_media_analysis", "analyze_text", "submit_feedback", "get_feedback_logs"]
