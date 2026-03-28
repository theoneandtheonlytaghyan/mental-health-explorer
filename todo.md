# Mental Health Explorer - Vercel Deployment Fixes

## Critical Fixes Required

- [x] Fix __APP_CONFIG__ initialization in index.html
- [x] Fix requirements.txt - remove sqlite3, add proper dependencies
- [x] Fix vercel.json for proper Python serverless routing
- [x] Fix database path configuration for /tmp directory
- [x] Fix API endpoint configuration and CORS
- [x] Add environment variable handling for Vercel
- [x] Fix Python API structure for Vercel serverless
- [x] Test all features end-to-end
- [x] Verify deployment works on Vercel

## Issues Identified

1. **Frontend API Integration**: `src/api.ts` expects `window.__APP_CONFIG__` but it's never initialized
2. **Python Dependencies**: `requirements.txt` includes `sqlite3` which is a built-in module
3. **Database Path**: Hard-coded paths like `apps/mental_health_explorer/backend/data/db` won't work on Vercel
4. **API Contract Mismatch**: Frontend expects module-based RPC, backend has simple FastAPI handler
5. **Vercel Configuration**: `vercel.json` routes `/api/(.*)` to `/api/index.py` but structure may not work
6. **Environment Variables**: No proper env var handling for API keys (NEXTTOKEN_API_KEY, etc.)
7. **Static Assets**: Asset paths use relative paths that may not work in production

## Deployment Strategy

- Convert to Vercel-compatible Python serverless functions
- Fix database to use /tmp or environment-based paths
- Initialize __APP_CONFIG__ from environment variables
- Ensure proper CORS and API routing
- Test all endpoints before final deployment
