"""Real Supabase repository adapter using PostgREST."""
from __future__ import annotations
from datetime import datetime, timezone
from uuid import uuid4
from typing import Any
import httpx
from app.config import get_settings

class TaskAccessor:
    def __init__(self, service: SupabaseService):
        self._service = service
    def __getitem__(self, task_id: str):
        task = self._service.get_task(task_id)
        if not task:
            raise KeyError(task_id)
        return task
    def get(self, task_id: str, default=None):
        task = self._service.get_task(task_id)
        return task if task is not None else default

class CampaignAccessor:
    def __init__(self, service: SupabaseService):
        self._service = service
    def get(self, campaign_id: str, default=None):
        if not campaign_id:
            return default
        camp = self._service.get_campaign(campaign_id)
        return camp if camp is not None else default

class SupabaseService:
    def __init__(self):
        self.memory: dict[str, list[dict]] = {}
        self._task_cache: dict[str, dict] = {}
        self.tasks = TaskAccessor(self)
        self.campaigns = CampaignAccessor(self)

    def _client(self) -> httpx.Client | None:
        settings = get_settings()
        if not settings.supabase_url:
            return None
        key = settings.supabase_service_role_key or settings.supabase_anon_key
        if not key:
            return None
        base_url = f"{settings.supabase_url.rstrip('/')}/rest/v1/"
        return httpx.Client(
            base_url=base_url,
            headers={
                "apikey": key,
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
                "Prefer": "return=representation"
            },
            timeout=15.0
        )

    def now(self):
        return datetime.now(timezone.utc).isoformat()

    def get_merchant_by_user(self, user_id: str):
        client = self._client()
        if not client:
            return None
        try:
            r = client.get(f"merchants?user_id=eq.{user_id}&select=*")
            r.raise_for_status()
            rows = r.json()
            if not rows:
                return None
            merchant = rows[0]
            # Attach preferred_language from preferences if exists
            prefs = client.get(f"merchant_preferences?merchant_id=eq.{merchant['id']}&select=*").json()
            merchant["preferred_language"] = prefs[0].get("preferred_language", "English") if prefs else "English"
            return merchant
        finally:
            client.close()

    def create_merchant(self, user_id: str, data: dict):
        existing = self.get_merchant_by_user(user_id)
        if existing:
            raise ValueError("Merchant already exists")
        client = self._client()
        if not client:
            raise RuntimeError("Database connection not configured")
        try:
            payload = {
                "user_id": user_id,
                "business_name": data.get("business_name"),
                "business_type": data.get("category"),
                "city": data.get("city")
            }
            r = client.post("merchants", json=payload)
            r.raise_for_status()
            merchant = r.json()[0]

            pref_payload = {
                "merchant_id": merchant["id"],
                "preferred_language": data.get("preferred_language", "English")
            }
            client.post("merchant_preferences", json=pref_payload)
            merchant["preferred_language"] = pref_payload["preferred_language"]
            return merchant
        finally:
            client.close()

    def update_merchant(self, merchant_id: str, data: dict):
        client = self._client()
        if not client:
            return {}
        try:
            update_data = {}
            if "business_name" in data and data["business_name"] is not None:
                update_data["business_name"] = data["business_name"]
            if "category" in data and data["category"] is not None:
                update_data["business_type"] = data["category"]
            if update_data:
                client.patch(f"merchants?id=eq.{merchant_id}", json=update_data)
            if "preferred_language" in data and data["preferred_language"] is not None:
                client.patch(f"merchant_preferences?merchant_id=eq.{merchant_id}", json={"preferred_language": data["preferred_language"]})
            r = client.get(f"merchants?id=eq.{merchant_id}&select=*")
            return r.json()[0] if r.status_code == 200 and r.json() else {}
        finally:
            client.close()

    def create_agent_task(self, merchant_id: str, goal: str):
        client = self._client()
        if not client:
            raise RuntimeError("Database connection not configured")
        try:
            payload = {
                "merchant_id": merchant_id,
                "goal": goal,
                "status": "CREATED",
                "current_agent": "Supervisor"
            }
            r = client.post("agent_tasks", json=payload)
            r.raise_for_status()
            task = r.json()[0]
            self._task_cache[task["id"]] = dict(task)
            return task
        finally:
            client.close()

    def get_task(self, task_id: str):
        client = self._client()
        if not client:
            return self._task_cache.get(task_id)
        try:
            r = client.get(f"agent_tasks?id=eq.{task_id}&select=*")
            if r.status_code == 200 and r.json():
                task = r.json()[0]
                if task_id in self._task_cache:
                    task.update(self._task_cache[task_id])
                return task
            return self._task_cache.get(task_id)
        except Exception:
            return self._task_cache.get(task_id)
        finally:
            client.close()

    def update_agent_task(self, task_id: str, **values):
        cached = self._task_cache.setdefault(task_id, {})
        cached.update(values)
        client = self._client()
        if client:
            try:
                allowed_cols = {"status", "current_agent", "goal", "metric", "timeframe", "target_value"}
                db_payload = {k: v for k, v in values.items() if k in allowed_cols}
                if db_payload:
                    client.patch(f"agent_tasks?id=eq.{task_id}", json=db_payload)
            except Exception:
                pass
            finally:
                client.close()
        return self.get_task(task_id)

    def create_agent_log(self, task_id: str, agent_name: str, action: str, status: str, input_data=None, output_data=None):
        row = {
            "task_id": task_id,
            "agent_name": agent_name,
            "action": action,
            "status": status,
            "input_data": input_data or {},
            "output_data": output_data or {},
            "timestamp": self.now()
        }
        client = self._client()
        if client:
            try:
                r = client.post("agent_logs", json=row)
                if r.status_code == 201 and r.json():
                    return r.json()[0]
            except Exception:
                pass
            finally:
                client.close()
        return row

    def task_logs(self, task_id: str):
        client = self._client()
        if not client:
            return []
        try:
            r = client.get(f"agent_logs?task_id=eq.{task_id}&order=timestamp.asc&select=*")
            return r.json() if r.status_code == 200 else []
        finally:
            client.close()

    def get_transactions(self, merchant_id: str):
        client = self._client()
        if not client:
            return []
        try:
            r = client.get(f"transactions?merchant_id=eq.{merchant_id}&select=*")
            return r.json() if r.status_code == 200 else []
        finally:
            client.close()

    def get_products(self, merchant_id: str):
        client = self._client()
        if not client:
            return []
        try:
            r = client.get(f"products?merchant_id=eq.{merchant_id}&select=*")
            return r.json() if r.status_code == 200 else []
        finally:
            client.close()

    def create_campaign(self, merchant_id: str, task_id: str, data: dict):
        client = self._client()
        row = {
            "merchant_id": merchant_id,
            "task_id": task_id,
            "status": "CREATED",
            "offer": data.get("offer"),
            "campaign_type": data.get("campaign_type"),
            "target_segment": data.get("target_segment"),
            "language": data.get("language", "English"),
            "message": data.get("message")
        }
        if client:
            try:
                r = client.post("campaigns", json=row)
                r.raise_for_status()
                return r.json()[0]
            finally:
                client.close()
        row["id"] = "CMP-" + uuid4().hex[:10].upper()
        return row

    def update_campaign(self, campaign_id: str, **values):
        client = self._client()
        if client:
            try:
                client.patch(f"campaigns?id=eq.{campaign_id}", json=values)
            finally:
                client.close()
        return {"id": campaign_id, **values}

    def get_campaign(self, campaign_id: str):
        client = self._client()
        if not client:
            return None
        try:
            r = client.get(f"campaigns?id=eq.{campaign_id}&select=*")
            return r.json()[0] if r.status_code == 200 and r.json() else None
        finally:
            client.close()

    def get_campaign_by_task(self, task_id: str):
        client = self._client()
        if not client:
            return None
        try:
            r = client.get(f"campaigns?task_id=eq.{task_id}&order=created_at.desc&limit=1&select=*")
            return r.json()[0] if r.status_code == 200 and r.json() else None
        finally:
            client.close()

    def create_campaign_result(self, campaign_id: str, data: dict):
        client = self._client()
        row = {
            "campaign_id": campaign_id,
            "baseline_value": data.get("baseline_value"),
            "result_value": data.get("result_value"),
            "status": data.get("status"),
            "recommendation": data.get("recommendation")
        }
        if client:
            try:
                r = client.post("campaign_results", json=row)
                if r.status_code == 201 and r.json():
                    return r.json()[0]
            finally:
                client.close()
        return row

    def get_campaign_result_by_campaign(self, campaign_id: str):
        client = self._client()
        if not client:
            return None
        try:
            r = client.get(f"campaign_results?campaign_id=eq.{campaign_id}&order=created_at.desc&limit=1&select=*")
            return r.json()[0] if r.status_code == 200 and r.json() else None
        finally:
            client.close()

    def get_merchant_preferences(self, merchant_id: str):
        client = self._client()
        if not client:
            return {"preferred_language": "English"}
        try:
            r = client.get(f"merchant_preferences?merchant_id=eq.{merchant_id}&select=*")
            if r.status_code == 200 and r.json():
                return r.json()[0]
            return {"preferred_language": "English"}
        finally:
            client.close()

    def create_product(self, merchant_id: str, data: dict):
        client = self._client()
        if not client:
            raise RuntimeError("Database connection not configured")
        try:
            payload = {
                "merchant_id": merchant_id,
                "name": data["name"],
                "category": data.get("category", "General"),
                "price": data["price"]
            }
            r = client.post("products", json=payload)
            r.raise_for_status()
            return r.json()[0]
        finally:
            client.close()

    def create_transaction(self, merchant_id: str, data: dict):
        client = self._client()
        if not client:
            raise RuntimeError("Database connection not configured")
        try:
            ts = data.get("transaction_time") or data.get("created_at") or self.now()
            payload = {
                "merchant_id": merchant_id,
                "product_id": data["product_id"],
                "amount": data["amount"],
                "transaction_time": ts
            }
            if data.get("customer_id") and len(str(data["customer_id"])) == 36:
                payload["customer_id"] = data["customer_id"]
            r = client.post("transactions", json=payload)
            r.raise_for_status()
            return r.json()[0]
        finally:
            client.close()

    def seed_store_data(self, merchant_id: str):
        existing_products = self.get_products(merchant_id)
        if existing_products:
            return {"status": "already_seeded", "product_count": len(existing_products)}

        # Create real products
        sample_prods = [
            {"name": "Masala Chai", "category": "Beverage", "price": 40.0},
            {"name": "Cold Coffee", "category": "Beverage", "price": 120.0},
            {"name": "Samosa", "category": "Snacks", "price": 30.0},
            {"name": "Veg Grilled Sandwich", "category": "Food", "price": 90.0}
        ]
        created_prods = []
        for p in sample_prods:
            created_prods.append(self.create_product(merchant_id, p))

        # Create realistic transactions across weekdays & weekends
        # Weekday: Sep 15, 16, 17, 2026. Weekend: Sep 12, 13, 2026
        txs = [
            {"product_id": created_prods[0]["id"], "amount": 80.0, "transaction_time": "2026-09-12T10:00:00Z"},
            {"product_id": created_prods[1]["id"], "amount": 240.0, "transaction_time": "2026-09-12T16:00:00Z"},
            {"product_id": created_prods[2]["id"], "amount": 60.0, "transaction_time": "2026-09-13T11:00:00Z"},
            {"product_id": created_prods[3]["id"], "amount": 180.0, "transaction_time": "2026-09-13T17:00:00Z"},
            {"product_id": created_prods[0]["id"], "amount": 120.0, "transaction_time": "2026-09-15T09:00:00Z"},
            {"product_id": created_prods[1]["id"], "amount": 360.0, "transaction_time": "2026-09-16T14:00:00Z"},
            {"product_id": created_prods[3]["id"], "amount": 270.0, "transaction_time": "2026-09-17T18:00:00Z"},
        ]
        created_txs = []
        for t in txs:
            created_txs.append(self.create_transaction(merchant_id, t))

        return {
            "status": "seeded",
            "products_created": len(created_prods),
            "transactions_created": len(created_txs)
        }

db = SupabaseService()
