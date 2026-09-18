import json
import httpx
from app.config import get_settings

class GroqService:
    async def strategy(self, prompt: str, fallback: dict) -> dict:
        settings = get_settings()
        if not settings.groq_api_key:
            return fallback

        try:
            system_prompt = (
                "You are an expert AI merchant strategy advisor for retail and small businesses. "
                "Analyze the merchant's business goal, insights, and memory, then propose an optimal promotion strategy. "
                "Respond ONLY with a valid JSON object with the following keys:\n"
                "- 'strategy': (string) short title of strategy\n"
                "- 'offer': (string) specific promotional offer, e.g. '15% OFF'\n"
                "- 'products': (list of strings) recommended product names\n"
                "- 'target_segment': (string) targeted audience segment, e.g. 'repeat_customers'\n"
                "- 'reasoning': (string) clear rationale explaining why this strategy addresses the goal"
            )

            headers = {
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "openai/gpt-oss-120b",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Business data:\n{prompt}"}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.3,
                "max_tokens": 500
            }

            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
                res.raise_for_status()
                data = res.json()
                content = data["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                
                # Validate required keys are present
                for key in ["strategy", "offer", "products", "target_segment", "reasoning"]:
                    if key not in parsed:
                        parsed[key] = fallback[key]
                if not isinstance(parsed["products"], list):
                    parsed["products"] = fallback["products"]
                return parsed
        except Exception:
            return fallback

groq = GroqService()

