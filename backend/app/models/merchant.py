from pydantic import BaseModel, Field
class MerchantCreate(BaseModel):
    business_name: str = Field(min_length=2, max_length=120)
    category: str | None = None
    preferred_language: str = "English"
class MerchantUpdate(BaseModel):
    business_name: str | None = None
    category: str | None = None
    preferred_language: str | None = None
