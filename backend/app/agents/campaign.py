from app.models.campaign import CampaignDraft
from app.services.sarvam_service import sarvam
from app.services.supabase_service import db
async def create(task_id, merchant_id, strategy, language):
    message=await sarvam.generate_regional_message(f"Weekend special: {strategy['offer']} on selected products. Shop now!",language)
    out=CampaignDraft(campaign_type='weekend_promotion',offer=strategy['offer'],products=strategy['products'],target_segment=strategy['target_segment'],language=language,message=message).model_dump()
    db.create_agent_log(task_id,'Campaign Agent','create_campaign','COMPLETED',strategy,out); return out
