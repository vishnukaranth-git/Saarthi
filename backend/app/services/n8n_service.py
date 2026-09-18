import httpx
from app.config import get_settings
class N8NService:
    async def trigger_campaign_execution(self, payload):
        settings=get_settings()
        if settings.demo_mode or not settings.n8n_webhook_url: return {'task_id':payload['task_id'],'campaign_id':payload.get('campaign_id'),'status':'EXECUTED','mode':'DEMO SIMULATION'}
        try:
            async with httpx.AsyncClient(timeout=15) as c:
                r=await c.post(settings.n8n_webhook_url,json=payload); r.raise_for_status(); data=r.json()
            if data.get('status') != 'EXECUTED': raise ValueError('Unexpected n8n response')
            return data
        except (httpx.HTTPError, ValueError) as e: raise RuntimeError(f'n8n execution failed: {e}') from e
n8n=N8NService()
