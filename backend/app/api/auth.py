import psycopg
from fastapi import APIRouter, Depends, HTTPException, status
from psycopg import errors

from app.auth.security import create_access_token, hash_password, verify_password
from app.database.connection import get_connection
from app.database.queries import create_user, find_user_by_email
from app.middleware.auth import get_current_user
from app.schemas.user import AuthToken, UserCreate, UserLogin, UserPublic

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthToken, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, connection: psycopg.Connection = Depends(get_connection)) -> AuthToken:
    if find_user_by_email(connection, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    try:
        user = create_user(connection, payload.full_name, payload.email, hash_password(payload.password))
        connection.commit()
    except errors.UniqueViolation:
        connection.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered") from None

    public_user = UserPublic(**user)
    return AuthToken(access_token=create_access_token(str(public_user.id)), user=public_user)


@router.post("/login", response_model=AuthToken)
def login(payload: UserLogin, connection: psycopg.Connection = Depends(get_connection)) -> AuthToken:
    user = find_user_by_email(connection, payload.email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    public_user = UserPublic(**{key: user[key] for key in ("id", "full_name", "email", "created_at", "updated_at")})
    return AuthToken(access_token=create_access_token(str(public_user.id)), user=public_user)


@router.get("/me", response_model=UserPublic)
def me(current_user: dict = Depends(get_current_user)) -> UserPublic:
    return UserPublic(**current_user)
