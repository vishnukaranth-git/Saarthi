from pydantic import BaseModel, Field

class ProductCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    category: str = "General"
    price: float = Field(gt=0)

class TransactionCreate(BaseModel):
    product_id: str
    customer_id: str | None = None
    amount: float = Field(gt=0)
    created_at: str | None = None
