from app.utils.validation import parse_goal
from app.models.campaign import CampaignDraft
from app.services.n8n_service import N8NService
import pytest

def test_goal_and_campaign_validation():
    assert parse_goal('Increase my weekend sales by 15%').target == 15
    assert CampaignDraft(campaign_type='x', offer='10% OFF', target_segment='repeat_customers', message='hello').offer == '10% OFF'

@pytest.mark.asyncio
async def test_n8n_service_payload_contract(monkeypatch):
    service = N8NService()
    payload = {
        'task_id': 'test-task-123',
        'merchant_id': 'merchant-uuid-456',
        'merchant_code': 'merchant-uuid-456',
        'campaign_id': 'camp-789',
        'campaign_type': 'weekend_promotion',
        'offer': '15% Cashback',
        'products': ['prod-1'],
        'target_segment': 'High Value',
        'language': 'Hindi',
        'message': 'Weekend special offer'
    }

    # Verify n8n mock/live contract
    class MockResponse:
        status_code = 200
        text = '{"status": "EXECUTED", "task_id": "test-task-123"}'
        def raise_for_status(self): pass
        def json(self): return {"status": "EXECUTED", "task_id": "test-task-123"}

    class MockAsyncClient:
        async def __aenter__(self): return self
        async def __aexit__(self, *args): pass
        async def post(self, url, json=None):
            assert url == 'https://vishnukaranth.app.n8n.cloud/webhook/saarthi-campaign-execution'
            assert json['task_id'] == 'test-task-123'
            assert json['merchant_id'] == 'merchant-uuid-456'
            assert json['merchant_code'] == 'merchant-uuid-456'
            assert json['offer'] == '15% Cashback'
            assert json['target_segment'] == 'High Value'
            return MockResponse()

    monkeypatch.setattr('httpx.AsyncClient', lambda **kw: MockAsyncClient())
    res = await service.trigger_campaign_execution(payload)
    assert res['status'] == 'EXECUTED'
    assert res['task_id'] == 'test-task-123'
