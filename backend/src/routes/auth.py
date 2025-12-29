from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from jose import JWTError, jwt
import httpx
import os

from ..models.database import get_db
from ..models.user import User
from ..schemas.auth import (
    UserRegister, 
    UserLogin, 
    TokenRefresh,
    UserResponse, 
    TokenResponse, 
    MessageResponse
)
from ..services.auth_service import (
    get_user_by_email,
    get_user_by_username,
    get_user_by_id,
    create_user,
    authenticate_user,
    create_tokens
)
from ..middleware.auth import get_current_user, get_password_hash
from ..config.security import get_settings

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Authentication"])

# GitHub OAuth 설정
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://www.serize.org")


@router.get("/github")
async def github_login():
    """GitHub OAuth 로그인 시작"""
    github_auth_url = (
        f"https://github.com/login/oauth/authorize"
        f"?client_id={GITHUB_CLIENT_ID}"
        f"&scope=user:email"
    )
    return RedirectResponse(url=github_auth_url)


@router.get("/github/callback")
async def github_callback(code: str, db: AsyncSession = Depends(get_db)):
    """GitHub OAuth 콜백"""
    
    # 1. code로 access_token 받기
    async with httpx.AsyncClient() as client:
        token_response = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": GITHUB_CLIENT_ID,
                "client_secret": GITHUB_CLIENT_SECRET,
                "code": code
            },
            headers={"Accept": "application/json"}
        )
        token_data = token_response.json()
    
    if "access_token" not in token_data:
        raise HTTPException(status_code=400, detail="GitHub 인증 실패")
    
    github_token = token_data["access_token"]
    
    # 2. GitHub 유저 정보 가져오기
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {github_token}"}
        )
        github_user = user_response.json()
        
        # 이메일 가져오기
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {github_token}"}
        )
        emails = email_response.json()
        primary_email = next(
            (e["email"] for e in emails if e["primary"]), 
            emails[0]["email"] if emails else None
        )
    
    if not primary_email:
        raise HTTPException(status_code=400, detail="GitHub 이메일을 가져올 수 없습니다")
    
    # 3. 유저 찾기 또는 생성
    user = await get_user_by_email(db, primary_email)
    
    if not user:
        # 새 유저 생성
        username = github_user.get("login", primary_email.split("@")[0])
        
        # 유저네임 중복 체크
        existing_username = await get_user_by_username(db, username)
        if existing_username:
            username = f"{username}_{github_user['id']}"
        
        user = User(
            email=primary_email,
            username=username,
            hashed_password=get_password_hash(f"github_{github_user['id']}"),
            is_active=True
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    # 4. 토큰 생성
    tokens = create_tokens(str(user.id))
    
    # 5. 프론트엔드로 리다이렉트 (토큰 포함)
    redirect_url = (
        f"{FRONTEND_URL}/auth/callback"
        f"?access_token={tokens['access_token']}"
        f"&refresh_token={tokens['refresh_token']}"
    )
    return RedirectResponse(url=redirect_url)


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    """회원가입"""
    
    # 이메일 중복 체크
    existing_email = await get_user_by_email(db, user_data.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 등록된 이메일입니다"
        )
    
    # 유저네임 중복 체크
    existing_username = await get_user_by_username(db, user_data.username)
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="이미 사용중인 사용자명입니다"
        )
    
    # 유저 생성
    user = await create_user(db, user_data)
    
    # 토큰 생성
    tokens = create_tokens(str(user.id))
    
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        user=UserResponse.model_validate(user)
    )


@router.post("/login", response_model=TokenResponse)
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    """로그인"""
    
    user = await authenticate_user(db, user_data.email, user_data.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="비활성화된 계정입니다"
        )
    
    tokens = create_tokens(str(user.id))
    
    return TokenResponse(
        access_token=tokens["access_token"],
        refresh_token=tokens["refresh_token"],
        user=UserResponse.model_validate(user)
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(token_data: TokenRefresh, db: AsyncSession = Depends(get_db)):
    """토큰 갱신"""
    
    try:
        payload = jwt.decode(
            token_data.refresh_token, 
            settings.SECRET_KEY, 
            algorithms=[settings.ALGORITHM]
        )
        user_id = payload.get("sub")
        token_type = payload.get("type")
        
        if not user_id or token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 토큰입니다"
            )
        
        user = await get_user_by_id(db, user_id)
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="유효하지 않은 사용자입니다"
            )
        
        tokens = create_tokens(str(user.id))
        
        return TokenResponse(
            access_token=tokens["access_token"],
            refresh_token=tokens["refresh_token"],
            user=UserResponse.model_validate(user)
        )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다"
        )


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """현재 로그인한 유저 정보"""
    return UserResponse.model_validate(current_user)


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """로그아웃 (클라이언트에서 토큰 삭제)"""
    return MessageResponse(message="로그아웃 되었습니다")

from ..schemas.auth import UserUpdate

@router.put("/me", response_model=UserResponse)
async def update_me(
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """프로필 수정"""
    
    user = await get_user_by_id(db, current_user["user_id"])
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다"
        )
    
    # 유저네임 변경
    if user_data.username and user_data.username != user.username:
        existing = await get_user_by_username(db, user_data.username)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이미 사용중인 사용자명입니다"
            )
        user.username = user_data.username
    
    # 비밀번호 변경
    if user_data.new_password:
        if not user_data.current_password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="현재 비밀번호를 입력해주세요"
            )
        
        if not verify_password(user_data.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="현재 비밀번호가 올바르지 않습니다"
            )
        
        user.hashed_password = get_password_hash(user_data.new_password)
    
    await db.commit()
    await db.refresh(user)
    
    return UserResponse.model_validate(user)