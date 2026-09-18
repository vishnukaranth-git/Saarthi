from pydantic import BaseModel, EmailStr

class CurrentUser(BaseModel):
    id: str
    email: str

class AuthCredentials(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: str
