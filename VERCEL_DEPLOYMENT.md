# Vercel Deployment Guide

This document outlines the fixes and requirements for successfully deploying the Mental Health Explorer to Vercel.

## Critical Fixes Applied

### 1. Fixed Python Dependency Issue
**Problem**: `nexttoken==0.0.1` doesn't exist on PyPI, causing build failures.
**Solution**: Updated `requirements.txt` to use `nexttoken>=0.5.0` (latest available version).

### 2. Fixed Build Command
**Problem**: Python dependencies weren't being installed before the build.
**Solution**: Updated `vercel.json` build command to:
```json
"buildCommand": "pip install -r requirements.txt && npm install && npm run build"
```

### 3. Fixed API Routing
**Problem**: Vercel rewrites weren't properly routing API requests to the FastAPI handler.
**Solution**: Added explicit `/api` route and improved regex matching in `vercel.json`:
```json
"rewrites": [
  {
    "source": "/api",
    "destination": "/api/index.py"
  },
  {
    "source": "/api/(.*)",
    "destination": "/api/index.py"
  },
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```

### 4. Fixed Database Configuration
**Problem**: WAL mode on ephemeral `/tmp` in serverless environment causes issues.
**Solution**: Disabled WAL mode in `api/db.py` for Vercel compatibility.

### 5. Improved API Error Handling
**Problem**: Async function handling could cause runtime errors.
**Solution**: Added async/await support in `api/index.py` RPC handler.

## Deployment Steps

### 1. Set Environment Variables in Vercel
Go to your Vercel project settings and add:

```
NEXTTOKEN_API_KEY=<your_api_key_from_https://nexttoken.dev>
NODE_ENV=production
```

### 2. Deploy
```bash
git push origin main
```

Vercel will automatically trigger a new deployment with the updated configuration.

### 3. Verify Deployment
- Check the Vercel deployment logs for any errors
- Test the health endpoint: `https://your-domain.vercel.app/api/health`
- Test a data endpoint: `https://your-domain.vercel.app/` (should load the frontend)

## Troubleshooting

### Build Fails with "nexttoken not found"
- Verify `requirements.txt` has `nexttoken>=0.5.0`
- Check that `NEXTTOKEN_API_KEY` is set in Vercel environment variables

### API Returns 500 Error
- Check Vercel function logs for the specific error
- Ensure `NEXTTOKEN_API_KEY` is correctly set
- Verify database initialization completed (check logs for `[BACKEND_STEP] Seeding database`)

### Frontend Shows "Server error"
- Check browser console for detailed error messages
- Verify `/api` endpoint is responding with `{"status": "ok"}` from health check
- Check that Vercel rewrites are correctly configured

## Architecture Notes

- **Frontend**: Vite + React + TypeScript (static assets in `/dist`)
- **Backend**: FastAPI + Python (serverless functions in `/api`)
- **Database**: SQLite in `/tmp` (ephemeral, resets on cold start)
- **AI Integration**: NextToken API for text analysis with Gemini model

The application uses an RPC-style API where the frontend POSTs to `/api` with function names and arguments.

## Performance Considerations

1. **Database Resets**: SQLite in `/tmp` resets on cold starts. Data is re-seeded automatically.
2. **Cold Starts**: First request after inactivity may take 5-10 seconds due to Python runtime initialization.
3. **Caching**: Frontend uses sessionStorage for RPC result caching to reduce API calls.
4. **AI Calls**: Text analysis calls are cached in `/tmp` to avoid redundant API calls to NextToken.

## Support

For issues with:
- **NextToken API**: Visit https://nexttoken.dev
- **Vercel Deployment**: Check https://vercel.com/docs
- **FastAPI**: See https://fastapi.tiangolo.com/
