from pydantic import BaseModel, Field
class GoalCreate(BaseModel): goal: str = Field(min_length=5, max_length=500)
class GoalParsed(BaseModel):
    goal: str
    target: float = Field(gt=0, le=1000)
    metric: str = "revenue"
    timeframe: str = "weekend"
class GoalCreated(BaseModel): task_id: str; status: str = "CREATED"
