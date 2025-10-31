import os
from datetime import datetime, timedelta
from typing import Optional
from dotenv import load_dotenv
from db import users_col
from fastapi import Depends, HTTPException, Request
from jose import jwt
from bson import ObjectId
from spotipy import Spotify
from spotify_utils import sp_oauth


load_dotenv()
JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRES_SECONDS = int(os.getenv("JWT_EXPIRES_SECONDS", 86400))


def create_jwt_for_user(user_doc: dict) -> str:
    payload = {
        "sub": str(user_doc.get("_id")),
        "spotify_id": user_doc.get("spotify_id"),
        "exp": datetime.utcnow() + timedelta(seconds=JWT_EXPIRES_SECONDS),
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    return token


def decode_jwt(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except Exception:
        return None


def upsert_user_from_spotify(spotify_user: dict, token_info: dict) -> dict:
    """
    spotify_user: result of sp.current_user()
    token_info: dict with access_token, refresh_token, expires_at
    """
    spotify_id = spotify_user.get("id")
    doc = {
        "spotify_id": spotify_id,
        "display_name": spotify_user.get("display_name"),
        "email": spotify_user.get("email"),
        "access_token": token_info.get("access_token"),
        "refresh_token": token_info.get("refresh_token"),
        "token_expires_at": token_info.get("expires_at"),
        "updated_at": datetime.utcnow(),
    }
    res = users_col.find_one_and_update(
        {"spotify_id": spotify_id},
        {"$set": doc, "$setOnInsert": {"created_at": datetime.utcnow()}},
        upsert=True,
        return_document=True,
    )
    # res is the pre-updated doc in older pymongo; ensure you fetch the updated doc:
    user_doc = users_col.find_one({"spotify_id": spotify_id})
    return user_doc


def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    try:
        payload = jwt.decode(
            token.split(" ")[1], JWT_SECRET, algorithms=[JWT_ALGORITHM]
        )
        user = users_col.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        token_info = {
            "access_token": user["access_token"],
            "refresh_token": user["refresh_token"],
            "expires_at": user["token_expires_at"],
        }
        if sp_oauth.is_token_expired(token_info):
            token_info = sp_oauth.refresh_access_token(token_info["refresh_token"])
            users_col.update_one(
                {"_id": user["_id"]},
                {
                    "$set": {
                        "access_token": token_info["access_token"],
                        "token_expires_at": token_info.get("expires_at"),
                    }
                },
            )
        return {"user": user, "spotify": Spotify(auth=token_info["access_token"])}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
