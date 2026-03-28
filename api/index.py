from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import json
import asyncio
from .main import get_survey_stats, get_survey_distributions, get_social_media_analysis, analyze_text, submit_feedback, get_feedback_logs

app = FastAPI()

# Configure CORS for Vercel deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api")
async def rpc_handler(request: Request):
    """Handle RPC requests from frontend."""
    try:
        data = await request.json()
        func_name = data.get("func")
        args = data.get("args", {})
        
        # Map function names to actual functions
        funcs = {
            "get_survey_stats": get_survey_stats,
            "get_survey_distributions": get_survey_distributions,
            "get_social_media_analysis": get_social_media_analysis,
            "analyze_text": analyze_text,
            "submit_feedback": submit_feedback,
            "get_feedback_logs": get_feedback_logs
        }
        
        if func_name not in funcs:
            raise HTTPException(status_code=404, detail=f"Function '{func_name}' not found")
        
        result = funcs[func_name](**args)
        # Handle async functions
        if asyncio.iscoroutine(result):
            result = await result
        return JSONResponse(content=result)
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] RPC handler error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

# Export app for Vercel
handler = app
