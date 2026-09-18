from app.models.campaign import CampaignDraft
from app.services.supabase_service import db
from app.services.groq_service import groq
async def select(task_id, merchant_id, parsed, insights, memory):
    products=insights['best_products'][:2]
    fallback={'strategy':'Targeted weekend promotion','offer':'10% OFF','products':products,'target_segment':'repeat_customers','reasoning':'Targets repeat customers during the identified peak period using measured sales data.'}
    out=await groq.strategy(str({'goal':parsed.model_dump(),'insights':insights,'memory':memory}),fallback)
    db.create_agent_log(task_id,'Strategy Agent','select_strategy','COMPLETED',{'insights':insights,'memory_count':len(memory)},out); return out
