# Lead Scoring Backend

## Overview
Backend service that scores leads (0-100) against an offer using rule-based logic and AI classification.

## Repository Structure
```
src/
  ├── controllers/    # Request handlers for each route
  ├── services/      # Core business logic (scoring, AI, CSV parsing)
  ├── models/        # Data models and storage
  ├── routes/        # API route definitions
  ├── utils/         # Helper utilities
  ├── config/        # Configuration (OpenAI setup)
  └── app.js         # Express app setup

sample_leads/       # Example CSV data
uploads/           # Upload directory for CSV files
```

## Core Features
- Rule-based scoring (role relevance, industry match, data completeness)
- AI-powered intent classification using OpenAI
- CSV lead data processing
- JSON and CSV export formats
See the repository root for a `src/` folder containing controllers, services, routes, models, utils, and config.

## Setup Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/lead-scoring-backend.git
cd lead-scoring-backend
```

2. Install dependencies
```bash
npm install
```

3. Set up environment
```bash
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

4. Start the server
```bash
npm start
# Server starts on http://localhost:5000
```

## API Documentation

### 1. Create an Offer
```bash
curl -X POST http://localhost:5000/api/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Enterprise CRM",
    "value_props": ["24/7 support", "Custom integration"],
    "ideal_use_cases": ["Large enterprises", "Financial services"]
  }'
```

### 2. Upload Leads (CSV)
```bash
curl -X POST http://localhost:5000/api/leads/upload \
  -F "file=@./sample_leads/leads.csv"
```

Required CSV columns:
- name
- role
- company
- industry
- location
- linkedin_bio

### 3. Run Scoring
```bash
curl -X POST http://localhost:5000/api/score
```

### 4. Get Results
```bash
# JSON format
curl http://localhost:5000/results

# CSV format
curl http://localhost:5000/api/score/export > scored_leads.csv
```

### Postman Collection
Import `LeadScoringBackend.postman_collection.json` for ready-to-use API requests.

Note about OpenAI API key
- If `OPENAI_API_KEY` is not set, the server will run but AI-based intent classification will use a deterministic local fallback (it will return "Intent: Low" with a short reason). This is intentional for local development so scoring still completes without network access.
- To enable real AI scoring, set `OPENAI_API_KEY` in your environment (or in `.env`) and restart the server. Example in PowerShell:

```powershell
$env:OPENAI_API_KEY = "sk-..."
npm start
```

- When `OPENAI_API_KEY` is missing the server prints a warning at startup to remind you that results are coming from a fallback stub.

## Endpoints
- `POST /api/offer` - save offer JSON
- `POST /api/leads/upload` - upload CSV (multipart form file field `file`)
- `POST /api/score` - run scoring (requires offer + uploaded leads)
- `GET /api/results` - fetch scored results
- `GET /api/results/export` - download CSV of results

## Assignment Compliance

### API Endpoints

- `POST /offer` — Accepts JSON with product/offer details.
- `POST /leads/upload` — Accepts CSV file with columns: name,role,company,industry,location,linkedin_bio
- `POST /score` — Runs scoring pipeline on uploaded leads.
- `GET /results` — Returns JSON array of scored leads (assignment alias for `/api/score`).
- `GET /api/score/export` — Exports results as CSV.

## Scoring Logic

The final lead score (0-100) combines rule-based scoring and AI classification:

### Rule-Based Scoring (max 50 points)

1. Role Relevance (max 20 points)
   - Decision makers (+20): CEO, Founder, Head, VP, Director, Chief, Owner
   - Influencers (+10): Manager, Lead, Senior, Strategist, Principal, Architect
   - Others (0)

2. Industry Match (max 20 points)
   - Exact match with ideal use cases (+20)
   - Adjacent/keyword overlap (+10)
   - No match (0)

3. Data Quality (max 10 points)
   - All required fields present (+10)
   - Missing fields (0)

### AI Intent Classification (max 50 points)

Uses OpenAI to analyze lead data against the offer:

```text
Prompt Template:
Offer:
Name: {offer.name}
Value props: {offer.value_props}
Ideal use cases: {offer.ideal_use_cases}

Prospect:
Name: {lead.name}
Role: {lead.role}
Company: {lead.company}
Industry: {lead.industry}
Location: {lead.location}
LinkedIn bio: {lead.linkedin_bio}

Task: Classify this prospect's buying intent (High, Medium, or Low) and explain why in 1-2 sentences.
```

AI Score Mapping:
- High intent: 50 points
- Medium intent: 30 points
- Low intent: 10 points

### Final Score Calculation
```javascript
final_score = Math.min(100, rule_score + ai_points)
```

### Example API Usage (cURL)

#### Set Offer
```bash
curl -X POST http://localhost:5000/api/offer \
  -H "Content-Type: application/json" \
  -d '{"name":"AI Outreach Automation","value_props":["24/7 outreach","6x more meetings"],"ideal_use_cases":["B2B SaaS mid-market"]}'
```

#### Upload Leads
```bash
curl -X POST http://localhost:5000/api/leads/upload -F "file=@./sample_leads/leads.csv"
```

#### Run Scoring
```bash
curl -X POST http://localhost:5000/api/score
```

#### Get Results
```bash
curl http://localhost:5000/results
```

#### Export as CSV
```bash
curl http://localhost:5000/api/score/export -o results.csv
```

### Setup Steps
1. Clone repo
2. `npm install`
3. `npm start`
4. Use the above API calls (or Postman)

## Live API

The service is deployed and available at:
https://lead-scoring-backend.onrender.com

## Testing & Development

### Running Tests
```bash
npm test
```

### Local Development
1. Start in development mode (with auto-reload):
```bash
npm run dev
```

2. Watch logs:
```bash
npm run logs
```

### Troubleshooting

1. File Upload Issues
- Ensure you're using form-data
- Field name must be "file"
- File must be CSV format
- Check file size (max 5MB)

2. Scoring Issues
- Verify offer is set (POST /api/offer first)
- Check CSV has required columns
- Ensure OPENAI_API_KEY is set
- Check rate limits if using free API key

3. Common Error Codes
- 400: Bad request (invalid input)
- 401: Unauthorized (API key issues)
- 413: File too large
- 415: Wrong file type
- 500: Server error (check logs)

Example calls to live API:
```bash
# Test API is up
curl https://lead-scoring-backend.onrender.com

# Create offer
curl -X POST https://lead-scoring-backend.onrender.com/api/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Offer",
    "value_props": ["Fast onboarding"],
    "ideal_use_cases": ["SMB"]
  }'
```

## Deployment Notes

This service is deployed on Render's free tier. For your own deployment:

1. Fork this repository

2. Deploy to Render:
   - Sign up at [Render](https://render.com)
   - New Web Service → Connect your fork
   - Configure:
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add environment variable:
     - `OPENAI_API_KEY` (get from [OpenAI](https://platform.openai.com))

Alternative deployment options: Railway, Vercel, or Heroku (all have free tiers)

### Loom Demo
- Add your Loom video link here after recording.

---

For any issues, see inline comments in code or open an issue.
