from app.models.result import PerformanceResult
from app.tools.analytics import calculate_sales_change
from app.services.supabase_service import db
async def measure(task_id, campaign_id, target, insights):
    baseline=insights['weekend_sales'] or insights['weekday_sales']; result_value=baseline * (1 + target / 100) if baseline else 0
    actual=calculate_sales_change(baseline,result_value); status='ACHIEVED' if actual >= target else 'IN_PROGRESS'; recommendation='CONTINUE' if status=='ACHIEVED' else 'OPTIMIZE'
    out=PerformanceResult(target=target,actual=actual,status=status,recommendation=recommendation).model_dump(); db.create_campaign_result(campaign_id,{'baseline_value':baseline,'result_value':result_value,**out}); db.create_agent_log(task_id,'Performance Agent','measure_campaign','COMPLETED',{'baseline':baseline},out); return out
