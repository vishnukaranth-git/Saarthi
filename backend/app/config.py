from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    supabase_url: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None
    groq_api_key: str | None = None
    cognee_api_key: str | None = None
    sarvam_api_key: str | None = None
    n8n_webhook_url: str | None = None
    n8n_callback_secret: str | None = None
    frontend_url: str = "http://localhost:3000"
    demo_mode: bool = False
@lru_cache
def get_settings() -> Settings: return Settings()
