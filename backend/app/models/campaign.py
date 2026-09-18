from pydantic import BaseModel, Field
class CampaignDraft(BaseModel):
    campaign_type: str
    offer: str
    products: list[str] = Field(default_factory=list)
    target_segment: str
    language: str = "English"
    message: str = Field(min_length=3, max_length=1000)
class MockCampaignRequest(CampaignDraft): merchant_id: str
