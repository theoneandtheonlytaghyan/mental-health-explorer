# Mental Health Explorer 

A professional-grade, full-stack data application designed to visualize workplace mental health insights and provide AI-powered narrative analysis. Built with a focus on empathy, data integrity, and actionable support.

## 🚀 Features

- **Executive Dashboard**: Interactive visualizations of global workplace mental health surveys, including treatment rates, gender distributions, and geographical hotspots.
- **Social Listening Insights**: Real-time analysis of mental health trends from social media feeds, utilizing AI to categorize severity and identify safety concerns.
- **AI Narrative Analyzer**: An empathetic text analysis tool powered by **Google Gemini** that provides:
    - Primary Concern Identification (e.g., Burnout, Anxiety)
    - Sentiment Trend Tracking
    - Actionable Support Steps
    - Confidence Scoring
- **Feedback Loop**: Integrated community feedback mechanism to drive iterative app improvements.

## 🛠 Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Shadcn/UI, Recharts, Lucide Icons.
- **Backend**: Python (FastAPI), SQLite (with Vercel /tmp compatibility).
- **AI/ML**: NextToken SDK (Orchestrating Google Gemini 2.5 Flash).
- **Database**: SQLite with automatic seeding (Vercel serverless compatible).
- **Deployment**: Vercel Serverless Functions.

## 📦 Project Structure

```text
mental_health_explorer/
├── api/                  # Python Backend (Serverless Functions)
│   ├── index.py          # FastAPI Entry Point
│   ├── main.py           # Core RPC Logic
│   ├── services.py       # AI & Processing Services
│   └── db.py             # Database Schema & Connectors
├── src/                  # React Frontend Source
│   ├── features/         # Modular Dashboard Views
│   ├── components/ui/    # Reusable UI Components
│   └── api.ts            # Frontend API Client
├── public/assets/        # High-quality Visual Assets
├── vercel.json           # Routing Configuration
├── requirements.txt      # Backend Dependencies
└── index.html            # Frontend Entry Point
```

## ⚙️ Setup & Deployment

### Local Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mental-health-explorer
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (frontend) with the backend API at `/api`.

### Vercel Deployment

#### Prerequisites
- A Vercel account (https://vercel.com)
- A NextToken API key (https://nexttoken.dev)
- This repository pushed to GitHub

#### Deployment Steps

1. **Connect Repository to Vercel**:
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose this repository
   - Click "Import"

2. **Configure Environment Variables**:
   - In the Vercel dashboard, go to **Settings** → **Environment Variables**
   - Add the following variable:
     - `NEXTTOKEN_API_KEY`: Your NextToken platform API key
   - Click "Save"

3. **Deploy**:
   - Click the "Deploy" button
   - Vercel will automatically build and deploy your application
   - Your app will be live at `https://<your-project>.vercel.app`

#### Important Notes

- **Database**: The application uses SQLite stored in Vercel's `/tmp` directory. Data is automatically seeded on first run.
- **API Key**: The `NEXTTOKEN_API_KEY` is required for the AI text analysis feature to work.
- **CORS**: All origins are allowed for development. For production, consider restricting CORS in `api/index.py`.

## 🔧 Key Fixes for Vercel Compatibility

This version includes the following fixes for seamless Vercel deployment:

1. **Database Path**: Changed from nested app structure to Vercel-compatible `/tmp` directory
2. **API Configuration**: Simplified RPC endpoint to `/api` with proper JSON request/response handling
3. **Frontend Config**: Added `__APP_CONFIG__` initialization in `index.html`
4. **Dependencies**: Removed `sqlite3` from `requirements.txt` (built-in Python module)
5. **CORS**: Configured for serverless environment
6. **Caching**: Uses `/tmp` for AI analysis cache

## 📝 API Endpoints

### POST /api
Main RPC endpoint for all backend operations.

**Request Format**:
```json
{
  "func": "function_name",
  "args": { "param1": "value1" }
}
```

**Available Functions**:
- `get_survey_stats`: Returns survey statistics
- `get_survey_distributions`: Returns distribution data by gender, country, treatment
- `get_social_media_analysis`: Returns social media insights
- `analyze_text`: AI-powered text analysis (requires NEXTTOKEN_API_KEY)
- `submit_feedback`: Submit user feedback
- `get_feedback_logs`: Retrieve feedback history

### GET /api/health
Health check endpoint for monitoring.

## 🚀 Performance & Optimization

- **Caching**: AI analysis results are cached in `/tmp` to reduce API calls
- **Session Storage**: Frontend caches API responses in browser session storage
- **Database Indexing**: Survey data is indexed for fast queries
- **Lazy Loading**: Dashboard charts load asynchronously

## 🔐 Security Considerations

- **Environment Variables**: All sensitive keys (NEXTTOKEN_API_KEY) are stored as Vercel environment variables
- **CORS**: Configured to accept all origins (update for production)
- **Input Validation**: Backend validates all RPC function names and parameters
- **Error Handling**: Sensitive errors are sanitized before sending to frontend

## 📄 License

This project is licensed under the MIT License.

---

**Last Updated**: March 2026
**Status**: Production Ready for Vercel Deployment
