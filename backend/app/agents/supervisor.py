from app.utils.validation import parse_goal
from app.services.supabase_service import db
from app.services.cognee_service import cognee
from app.agents import insights, strategy, campaign, execution, performance
async def run(task_id: str):
    task=db.tasks[task_id]; merchant_id=task['merchant_id']
    try:
        db.update_agent_task(task_id,status='UNDERSTANDING',current_agent='Supervisor'); parsed=parse_goal(task['goal']); db.create_agent_log(task_id,'Supervisor','parse_goal','COMPLETED',{'goal':task['goal']},parsed.model_dump())
        db.update_agent_task(task_id,status='ANALYZING',current_agent='Insights Agent'); ins=await insights.analyze(task_id,merchant_id)
        db.update_agent_task(task_id,status='STRATEGIZING',current_agent='Strategy Agent'); memory=await cognee.recall_memory(merchant_id,task['goal']); strat=await strategy.select(task_id,merchant_id,parsed,ins,memory)
        db.update_agent_task(task_id,status='CREATING_CAMPAIGN',current_agent='Campaign Agent'); prefs=db.get_merchant_preferences(merchant_id); draft=await campaign.create(task_id,merchant_id,strat,prefs['preferred_language'])
        db.update_agent_task(task_id,status='EXECUTING',current_agent='Execution Agent'); stored,_=await execution.execute(task_id,merchant_id,draft)
        db.update_agent_task(task_id,status='MEASURING',current_agent='Performance Agent'); perf=await performance.measure(task_id,stored['id'],parsed.target,ins)
        await cognee.remember_memory(merchant_id,{'goal':task['goal'],'strategy':strat['strategy'],'outcome':perf})
        db.update_agent_task(task_id,status='COMPLETED',current_agent='Supervisor',campaign_id=stored['id'],performance=perf,recommendation=perf['recommendation'])
        db.create_agent_log(task_id,'Supervisor','evaluate_outcome','COMPLETED',perf,{'decision':perf['recommendation']})
    except Exception as e:
        db.update_agent_task(task_id,status='FAILED',error='Workflow failed')
        db.create_agent_log(task_id,'Supervisor','workflow_failure','FAILED',{}, {'error':str(e)[:500]})
