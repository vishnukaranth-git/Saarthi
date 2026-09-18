from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
from app.config import get_settings
from app.dependencies import get_current_user
from app.models.auth import CurrentUser, AuthCredentials, AuthResponse
from app.models.goal import GoalCreate, GoalCreated
from app.models.merchant import MerchantCreate, MerchantUpdate
from app.models.campaign import MockCampaignRequest
from app.models.catalog import ProductCreate, TransactionCreate
from app.services.supabase_service import db
from app.agents.supervisor import run

app = FastAPI(title='Paytm Saarthi AI Backend', version='1.0.0')
app.add_middleware(
    CORSMiddleware,
    allow_origins=[get_settings().frontend_url, "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get('/health')
async def health():
    return {'status': 'ok', 'service': 'paytm-saarthi-backend', 'demo_mode': get_settings().demo_mode}

# ----------------- Real Supabase Authentication ----------------- #
@app.post('/api/auth/signup', response_model=AuthResponse)
async def signup(creds: AuthCredentials):
    settings = get_settings()
    if not settings.supabase_url:
        raise HTTPException(500, 'Supabase URL is not configured')

    key = settings.supabase_service_role_key or settings.supabase_anon_key
    async with httpx.AsyncClient(timeout=15.0) as client:
        # If service role key is available, create confirmed user
        if settings.supabase_service_role_key:
            admin_url = f"{settings.supabase_url.rstrip('/')}/auth/v1/admin/users"
            r = await client.post(
                admin_url,
                headers={"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"},
                json={"email": creds.email, "password": creds.password, "email_confirm": True}
            )
            if r.status_code not in (200, 201):
                raise HTTPException(r.status_code, f"User creation failed: {r.text}")
        else:
            signup_url = f"{settings.supabase_url.rstrip('/')}/auth/v1/signup"
            r = await client.post(
                signup_url,
                headers={"apikey": key, "Content-Type": "application/json"},
                json={"email": creds.email, "password": creds.password}
            )
            if r.status_code not in (200, 201):
                raise HTTPException(r.status_code, f"Signup failed: {r.text}")

        # Now authenticate to issue JWT
        token_url = f"{settings.supabase_url.rstrip('/')}/auth/v1/token?grant_type=password"
        anon_key = settings.supabase_anon_key or settings.supabase_service_role_key
        tr = await client.post(
            token_url,
            headers={"apikey": anon_key, "Content-Type": "application/json"},
            json={"email": creds.email, "password": creds.password}
        )
        if tr.status_code != 200:
            raise HTTPException(tr.status_code, f"Authentication failed: {tr.text}")
        data = tr.json()
        return AuthResponse(
            access_token=data["access_token"],
            token_type="bearer",
            user_id=data["user"]["id"],
            email=data["user"]["email"]
        )

@app.post('/api/auth/login', response_model=AuthResponse)
async def login(creds: AuthCredentials):
    settings = get_settings()
    if not settings.supabase_url:
        raise HTTPException(500, 'Supabase URL is not configured')
    anon_key = settings.supabase_anon_key or settings.supabase_service_role_key
    async with httpx.AsyncClient(timeout=15.0) as client:
        token_url = f"{settings.supabase_url.rstrip('/')}/auth/v1/token?grant_type=password"
        tr = await client.post(
            token_url,
            headers={"apikey": anon_key, "Content-Type": "application/json"},
            json={"email": creds.email, "password": creds.password}
        )
        if tr.status_code != 200:
            raise HTTPException(401, f"Login failed: {tr.text}")
        data = tr.json()
        return AuthResponse(
            access_token=data["access_token"],
            token_type="bearer",
            user_id=data["user"]["id"],
            email=data["user"]["email"]
        )

@app.get('/api/auth/me')
async def me(user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    return {'id': user.id, 'email': user.email, 'profile': {'user_id': user.id}, 'merchant': merchant}

# ----------------- Merchant Profile & Setup ----------------- #
@app.post('/api/merchants')
async def create_merchant(body: MerchantCreate, user: CurrentUser = Depends(get_current_user)):
    try:
        return db.create_merchant(user.id, body.model_dump())
    except ValueError as e:
        raise HTTPException(409, str(e))

@app.get('/api/merchants/me')
async def merchant_me(user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found')
    return merchant

@app.patch('/api/merchants/me')
async def merchant_update(body: MerchantUpdate, user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found')
    return db.update_merchant(merchant['id'], body.model_dump())

@app.post('/api/merchants/seed-initial-data')
async def seed_data(user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found. Please create merchant profile first.')
    return db.seed_store_data(merchant['id'])

# ----------------- Products & Transactions ----------------- #
@app.post('/api/products')
async def add_product(body: ProductCreate, user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found')
    return db.create_product(merchant['id'], body.model_dump())

@app.get('/api/products')
async def list_products(user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found')
    return db.get_products(merchant['id'])

@app.post('/api/transactions')
async def add_transaction(body: TransactionCreate, user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found')
    return db.create_transaction(merchant['id'], body.model_dump())

@app.get('/api/transactions')
async def list_transactions(user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found')
    return db.get_transactions(merchant['id'])

# ----------------- Goals & Autonomous Agents ----------------- #
@app.post('/api/goals', response_model=GoalCreated)
async def create_goal(body: GoalCreate, bg: BackgroundTasks, user: CurrentUser = Depends(get_current_user)):
    merchant = db.get_merchant_by_user(user.id)
    if not merchant:
        raise HTTPException(404, 'Merchant profile not found. Create merchant before setting goals.')
    task = db.create_agent_task(merchant['id'], body.goal)
    bg.add_task(run, task['id'])
    return GoalCreated(task_id=task['id'])

def owned_task(task_id: str, user: CurrentUser):
    task = db.tasks.get(task_id)
    merchant = db.get_merchant_by_user(user.id)
    if not task or not merchant or task['merchant_id'] != merchant['id']:
        raise HTTPException(404, 'Task not found')
    return task

@app.get('/api/goals/{task_id}')
async def goal_status(task_id: str, user: CurrentUser = Depends(get_current_user)):
    task = owned_task(task_id, user)
    campaign = db.get_campaign_by_task(task_id) or db.campaigns.get(task.get('campaign_id')) or {}
    camp_id = campaign.get('id') if campaign else None
    perf = db.get_campaign_result_by_campaign(camp_id) if camp_id else None
    return {
        'task_id': task['id'],
        'goal': task['goal'],
        'status': task['status'],
        'current_agent': task['current_agent'],
        'agents': db.task_logs(task_id),
        'campaign': campaign,
        'performance': perf or task.get('performance', {}),
        'recommendation': (perf.get('recommendation') if perf else None) or task.get('recommendation')
    }

@app.get('/api/agent-logs/{task_id}')
async def logs(task_id: str, user: CurrentUser = Depends(get_current_user)):
    owned_task(task_id, user)
    return db.task_logs(task_id)

@app.get('/api/agent-tasks/{task_id}')
async def task_state(task_id: str, user: CurrentUser = Depends(get_current_user)):
    return owned_task(task_id, user)

@app.post('/api/mock-paytm/campaign')
async def mock_paytm(body: MockCampaignRequest):
    return {'campaign_id': 'CMP-' + body.merchant_id[:8].upper(), 'status': 'EXECUTED', 'mode': 'SIMULATION'}

@app.post('/api/n8n/callback')
async def n8n_callback(request: Request):
    configured_secret = get_settings().n8n_callback_secret
    if configured_secret:
        secret = request.headers.get('X-N8N-Secret')
        if secret != configured_secret:
            raise HTTPException(401, 'Invalid callback secret')
    data = await request.json()
    task_id = data.get('task_id')
    if not task_id or not db.get_task(task_id):
        raise HTTPException(404, 'Task not found')
    db.create_agent_log(task_id, 'n8n', 'callback', 'COMPLETED', {}, data)
    return {'status': 'received'}
