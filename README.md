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
- **Backend**: Python (FastAPI), SQLAlchemy/Psycopg2.
- **AI/ML**: NextToken SDK (Orchestrating Google Gemini 2.5 Flash).
- **Database**: Vercel Postgres (Production) / SQLite (Local Dev).
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
└── requirements.txt      # Backend Dependencies
```

## ⚙️ Setup & Deployment

### Local Development
1. Clone the repository.
2. Install frontend dependencies: `npm install`.
3. Install backend dependencies: `pip install -r requirements.txt`.
4. Run the development server: `npm run dev`.

### Vercel Deployment
1. Connect this repository to your **Vercel** dashboard.
2. Add your **Environment Variables**:
   - `NEXTTOKEN_API_KEY`: Your NextToken platform key.
3. In the Vercel **Storage** tab, create and connect a **Vercel Postgres** database.
4. Deploy!

## 📄 License
This project is licensed under the MIT License.

---

