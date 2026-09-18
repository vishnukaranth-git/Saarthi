from app.services.supabase_service import db
class CogneeService:
    async def remember_memory(self, merchant_id, memory): db.memory.setdefault(merchant_id,[]).append(memory)
    async def recall_memory(self, merchant_id, _query): return db.memory.get(merchant_id, [])[-5:]
    async def forget_memory(self, merchant_id): db.memory.pop(merchant_id,None)
cognee = CogneeService()
