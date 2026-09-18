import httpx
from fastapi import Header, HTTPException
from app.config import get_settings
from app.models.auth import CurrentUser

async def get_current_user(authorization: str | None = Header(default=None)) -> CurrentUser:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(401, 'Missing Bearer token')
    token = authorization[7:].strip()
    settings = get_settings()

    # Real Supabase Auth token validation
    if settings.supabase_url:
        key = settings.supabase_anon_key or settings.supabase_service_role_key
        if key:
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(
                        f"{settings.supabase_url.rstrip('/')}/auth/v1/user",
                        headers={
                            "Authorization": f"Bearer {token}",
                            "apikey": key
                        }
                    )
                if resp.status_code == 200:
                    data = resp.json()
                    return CurrentUser(id=data["id"], email=data.get("email") or f"{data['id']}@supabase.local")
                else:
                    raise HTTPException(401, f"Invalid Supabase Auth token: {resp.text}")
            except httpx.HTTPError as e:
                raise HTTPException(401, f"Auth verification failed: {e}")

    # Explicit fallback for demo token only if demo_mode is explicitly true
    if settings.demo_mode and token.startswith('demo:'):
        return CurrentUser(id=token[5:], email=f'{token[5:]}@demo.local')

    raise HTTPException(401, 'Token validation requires configured Supabase Auth integration')
