import httpx
from app.config import get_settings
class N8NService:
    async def trigger_campaign_execution(self, payload):
        settings=get_settings()
        if settings.demo_mode or not settings.n8n_webhook_url: return {'task_id':payload['task_id'],'campaign_id':payload.get('campaign_id'),'status':'EXECUTED','mode':'DEMO SIMULATION'}
        try:
            async with httpx.AsyncClient(timeout=30) as c:
                r = await c.post(settings.n8n_webhook_url, json=payload)
                r.raise_for_status()
                try:
                    data = r.json()
                except Exception:
                    data = {'status': 'EXECUTED', 'text': r.text}
            if isinstance(data, list) and len(data) > 0:
                data = data[0]
            if not isinstance(data, dict):
                data = {'status': 'EXECUTED', 'response': data}
            if 'status' not in data:
                data['status'] = 'EXECUTED'
            return data
        except Exception as e:
            raise RuntimeError(f'n8n execution failed: {e}') from e
n8n=N8NService()
