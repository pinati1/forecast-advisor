from typing import Optional

from fastapi import APIRouter


router = APIRouter(prefix="/beaches", tags=["beaches"])


@router.get("")
async def get_beaches(location: Optional[str] = None):
    # Skeleton implementation – will be implemented later
    return None


@router.get("/{beach_id}")
async def get_beach(beach_id: str):
    # Skeleton implementation – will be implemented later
    return None

