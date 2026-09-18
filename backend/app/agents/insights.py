from app.tools.analytics import calculate_weekend_sales, calculate_weekday_sales, calculate_sales_change, get_top_products, get_peak_hours, get_customer_segment_performance, get_campaign_history
from app.services.supabase_service import db
async def analyze(task_id, merchant_id):
    rows=db.get_transactions(merchant_id); weekend=calculate_weekend_sales(rows); weekday=calculate_weekday_sales(rows)
    out={'weekend_sales':weekend,'weekday_sales':weekday,'weekend_sales_change':calculate_sales_change(weekday,weekend),'best_products':get_top_products(rows),'peak_period':get_peak_hours(rows),'customer_segments':get_customer_segment_performance(rows),'campaign_history':get_campaign_history(merchant_id),'finding':'Weekend sales are underperforming' if weekend < weekday else 'Weekend sales are stable'}
    db.create_agent_log(task_id,'Insights Agent','analyze_sales','COMPLETED',{'transaction_count':len(rows)},out); return out
