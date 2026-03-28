from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from .main import get_survey_stats, get_survey_distributions, get_social_media_analysis, analyze_text, submit_feedback, get_feedback_logs

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api")
async def rpc_handler(request: Request):
    try:
        data = await request.json()
        func_name = data.get("func")
        args = data.get("args", {})
        funcs = {
            "get_survey_stats": get_survey_stats,
            "get_survey_distributions": get_survey_distributions,
            "get_social_media_analysis": get_social_media_analysis,
            "analyze_text": analyze_text,
            "submit_feedback": submit_feedback,
            "get_feedback_logs": get_feedback_logs
        }
        if func_name in funcs:
            return funcs[func_name](**args)
        raise HTTPException(status_code=404, detail=f"Function '{func_name}' not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
