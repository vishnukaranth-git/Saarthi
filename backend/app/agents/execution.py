from app.services.n8n_service import n8n
from app.services.supabase_service import db
async def execute(task_id, merchant_id, campaign):
    stored=db.create_campaign(merchant_id,task_id,campaign); payload={'task_id':task_id,'merchant_id':merchant_id,'campaign_id':stored['id'],**campaign}
    result=await n8n.trigger_campaign_execution(payload); db.update_campaign(stored['id'],status=result['status'])
    db.create_agent_log(task_id,'Execution Agent','trigger_n8n','COMPLETED',payload,result); return stored,result
