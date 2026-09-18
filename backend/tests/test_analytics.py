from app.tools.analytics import calculate_sales_change, calculate_weekend_sales, get_top_products
def test_calculations():
    rows=[{'timestamp':'2026-09-12T12:00:00Z','amount':100,'product_id':'A','customer_id':'c'}]
    assert calculate_weekend_sales(rows)==100; assert calculate_sales_change(100,115)==15; assert get_top_products(rows)==['A']
