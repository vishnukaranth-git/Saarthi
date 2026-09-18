# Paytm Saarthi AI Backend

An autonomous, multi-agent FastAPI backend for the Paytm Build for India AI Hackathon. A merchant submits a business goal; a supervisor coordinates Insights, Strategy, Campaign, Execution, and Performance agents. This is a prototype: the Paytm endpoint is explicitly simulated and is not a production Paytm integration.

## Run locally

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
$env:DEMO_MODE='true'
python run.py
```

Open `/docs` for OpenAPI documentation. Health: `GET /health` returns `{"status":"ok","service":"paytm-saarthi-backend"}`.

## Authentication and demo

Production requests must carry a Supabase-issued Bearer token. Configure `SUPABASE_URL` and `SUPABASE_ANON_KEY`; ensure RLS restricts every merchant-owned table to `merchant.user_id = auth.uid()`. No passwords are stored here.

For a credential-free walkthrough only, set `DEMO_MODE=true` and use `Authorization: Bearer demo:merchant-1`. Create the merchant profile before creating a goal. Demo n8n execution is clearly returned as `DEMO SIMULATION`.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /health` | service health |
| `GET /api/auth/me` | authenticated identity and merchant |
| `POST/GET/PATCH /api/merchants` / `/me` | merchant onboarding/profile |
| `POST /api/goals` | create task and start workflow asynchronously |
| `GET /api/goals/{task_id}` | workflow status/results |
| `GET /api/agent-logs/{task_id}` | chronological agent logs |
| `GET /api/agent-tasks/{task_id}` | task state |
| `POST /api/mock-paytm/campaign` | simulation only |
| `POST /api/n8n/callback` | protected webhook callback |

## Environment

Copy `.env.example`. `N8N_WEBHOOK_URL` routes campaign execution to n8n; configure n8n to invoke the mock campaign endpoint and then call `/api/n8n/callback` with `X-N8N-Secret` equal to `N8N_CALLBACK_SECRET`. `GROQ_API_KEY`, `COGNEE_API_KEY`, and `SARVAM_API_KEY` are reserved for their service adapters; failures must fall back safely and never expose credentials.

## Data and deployment

Supabase remains the structured source of truth for `profiles`, `merchants`, `products`, `customers`, `transactions`, `agent_tasks`, `agent_logs`, `campaigns`, `campaign_results`, and `merchant_preferences`. The included repository service is an in-memory demo adapter; replace its methods with Supabase REST/client calls after confirming your existing schema—do not recreate tables. Cognee should store only merchant-scoped outcome context, not table replicas.

Deploy to Cloud Run with a production ASGI command such as `uvicorn app.main:app --host 0.0.0.0 --port $PORT`. Set all environment variables through Cloud Run secret/config management, never in frontend code.

## Tests

```powershell
cd backend
pytest -q
```

Tests cover health, deterministic analytics, goal parsing, and campaign validation. Add Supabase integration tests only with a dedicated test project and credentials.
