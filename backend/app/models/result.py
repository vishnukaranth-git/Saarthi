from pydantic import BaseModel
class PerformanceResult(BaseModel): target: float; actual: float; status: str; recommendation: str
