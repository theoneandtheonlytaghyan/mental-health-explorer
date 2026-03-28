import json
import os
import hashlib
import tempfile
from nexttoken import NextToken
from .db import _get_db

# Use /tmp for Vercel serverless compatibility
CACHE_DIR = os.path.join(tempfile.gettempdir(), "mental_health_explorer_cache")

def _cache_key(prefix, **kwargs):
    """Generate a cache key from prefix and kwargs."""
    raw = json.dumps(kwargs, sort_keys=True)
    return f"{prefix}_{hashlib.sha256(raw.encode()).hexdigest()[:12]}"

def _read_cache(key):
    """Read from cache file."""
    path = os.path.join(CACHE_DIR, f"{key}.json")
    if os.path.exists(path):
        print(f"[BACKEND_STEP] cache_hit for key={key}")
        with open(path) as f:
            return json.load(f)
    print(f"[BACKEND_STEP] cache_miss for key={key}")
    return None

def _write_cache(key, data):
    """Write to cache file."""
    os.makedirs(CACHE_DIR, exist_ok=True)
    path = os.path.join(CACHE_DIR, f"{key}.json")
    with open(path, "w") as f:
        json.dump(data, f)
    print(f"[BACKEND_STEP] cache_write for key={key}")

def analyze_text_ai(text: str):
    """Analyze text using AI with caching."""
    print(f"[BACKEND_START] analyze_text_ai for text len={len(text)}")
    
    cache_key = _cache_key("analysis", text=text)
    cached = _read_cache(cache_key)
    if cached:
        return cached

    try:
        client = NextToken()
        prompt = f"""Analyze the following text for mental health indicators and workplace wellness context.
Text: "{text}"

Return a JSON object with:
- primary_concern (string: e.g., 'Anxiety', 'Depression', 'Stress', 'Workplace Burnout')
- severity_level (string: 'Minimal', 'Mild', 'Moderate', 'High', 'Severe')
- confidence_score (number: 0.0 to 1.0 representing analysis certainty)
- sentiment_trend (string: 'Positive/Improving', 'Neutral/Stable', 'Negative/Declining')
- support_needed (list of strings: e.g., ['Therapy', 'Sleep hygiene', 'Mindfulness', 'Crisis support'])
- actionable_steps (list of strings: 2-3 specific, immediate steps the user can take)
- analysis_summary (string: 2-3 sentence empathetic summary)
"""
        response = client.chat.completions.create(
            model="gemini-2.5-flash-lite",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=4000,
            response_format={"type": "json_object"}
        )
        result = json.loads(response.choices[0].message.content)
        print(f"[BACKEND_SUCCESS] AI analysis complete")
        _write_cache(cache_key, result)
        return result
    except Exception as e:
        print(f"[BACKEND_ERROR] AI analysis failed: {e}")
        raise

def get_survey_stats_logic():
    """Get survey statistics from database."""
    print("[BACKEND_START] get_survey_stats_logic")
    conn = _get_db()
    try:
        total_responses = conn.execute("SELECT COUNT(*) FROM survey_data").fetchone()[0]
        treatment_yes = conn.execute("SELECT COUNT(*) FROM survey_data WHERE treatment = 'Yes'").fetchone()[0]
        interference_count = conn.execute("SELECT COUNT(*) FROM survey_data WHERE work_interference IN ('Often', 'Sometimes')").fetchone()[0]
        
        treatment_rate = round(treatment_yes / total_responses, 2) if total_responses > 0 else 0
        work_interference_rate = round(interference_count / total_responses, 2) if total_responses > 0 else 0
        
        result = {
            "total_responses": total_responses,
            "treatment_rate": treatment_rate,
            "work_interference_rate": work_interference_rate
        }
        print(f"[BACKEND_SUCCESS] stats calculated: {result}")
        return result
    finally:
        conn.close()

def get_survey_distributions_logic():
    """Get survey distribution data from database."""
    print("[BACKEND_START] get_survey_distributions_logic")
    conn = _get_db()
    try:
        distributions = []
        
        # Gender
        rows = conn.execute("SELECT gender, COUNT(*) as count FROM survey_data GROUP BY gender").fetchall()
        distributions.append({
            "category": "Gender",
            "data": [{"label": r["gender"], "value": r["count"]} for r in rows]
        })
        
        # Country
        rows = conn.execute("SELECT country, COUNT(*) as count FROM survey_data GROUP BY country ORDER BY count DESC LIMIT 5").fetchall()
        distributions.append({
            "category": "Top Countries",
            "data": [{"label": r["country"], "value": r["count"]} for r in rows]
        })
        
        # Treatment
        rows = conn.execute("SELECT treatment, COUNT(*) as count FROM survey_data GROUP BY treatment").fetchall()
        distributions.append({
            "category": "Treatment Received",
            "data": [{"label": r["treatment"], "value": r["count"]} for r in rows]
        })
        
        print(f"[BACKEND_SUCCESS] distributions fetched")
        return distributions
    finally:
        conn.close()
