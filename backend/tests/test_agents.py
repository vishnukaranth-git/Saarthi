from app.utils.validation import parse_goal
from app.models.campaign import CampaignDraft
def test_goal_and_campaign_validation():
    assert parse_goal('Increase my weekend sales by 15%').target==15
    assert CampaignDraft(campaign_type='x',offer='10% OFF',target_segment='repeat_customers',message='hello').offer=='10% OFF'
