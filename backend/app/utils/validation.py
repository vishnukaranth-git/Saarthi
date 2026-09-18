from app.models.goal import GoalParsed
import re
def parse_goal(goal: str) -> GoalParsed:
    found = re.search(r"(\d+(?:\.\d+)?)\s*%", goal)
    return GoalParsed(goal=goal, target=float(found.group(1)) if found else 10, metric="revenue" if any(x in goal.lower() for x in ("sale", "revenue")) else "orders", timeframe="weekend" if "weekend" in goal.lower() else "next 7 days")
