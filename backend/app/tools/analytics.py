from datetime import datetime, timezone
from collections import defaultdict, Counter

def _parse_ts(ts):
    if isinstance(ts, datetime):
        return ts
    return datetime.fromisoformat(str(ts).replace('Z', '+00:00'))

def _row_ts(r):
    ts = r.get('transaction_time') or r.get('timestamp') or r.get('created_at')
    return _parse_ts(ts)

def calculate_weekend_sales(rows):
    if not rows:
        return 0.0
    total = sum(float(r.get('amount', 0)) for r in rows if _row_ts(r).weekday() >= 5)
    return float(total)

def calculate_weekday_sales(rows):
    if not rows:
        return 0.0
    total = sum(float(r.get('amount', 0)) for r in rows if _row_ts(r).weekday() < 5)
    return float(total)

def calculate_sales_change(baseline, result):
    return 0.0 if baseline == 0 else round((result - baseline) / baseline * 100, 2)

def get_top_products(rows, limit=3):
    if not rows:
        return []
    totals = defaultdict(float)
    for r in rows:
        totals[r['product_id']] += float(r.get('amount', 0))
    sorted_prods = sorted(totals.items(), key=lambda x: x[1], reverse=True)
    return [p[0] for p in sorted_prods[:limit]]

def get_peak_hours(rows):
    if not rows:
        return 'No transaction data'
    hours = [_row_ts(r).hour for r in rows]
    mode_hour = Counter(hours).most_common(1)[0][0]
    return f'{int(mode_hour)}:00 - {int(mode_hour)+1}:00'

def get_customer_segment_performance(rows):
    if not rows:
        return {}
    totals = defaultdict(float)
    for r in rows:
        totals[str(r['customer_id'])] += float(r.get('amount', 0))
    return dict(totals)

def get_campaign_history(_merchant_id):
    return []

