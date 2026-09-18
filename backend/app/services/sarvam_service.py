from app.config import get_settings
class SarvamService:
    async def generate_regional_message(self, message, language):
        # Do not fail a campaign because a translation provider is unavailable.
        return message if language.lower() == 'english' or not get_settings().sarvam_api_key else message
sarvam = SarvamService()
