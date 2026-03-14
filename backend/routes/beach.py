from typing import Optional, List

from fastapi import APIRouter

from models import Beach


router = APIRouter(prefix="/beaches", tags=["beaches"])


@router.get("")
async def get_beaches(location: Optional[str] = None) -> Optional[List[Beach]]:
    # Skeleton implementation – will be implemented later
    return None


@router.get("/{beach_id}")
async def get_beach(beach_id: str) -> Optional[Beach]:
    # Skeleton implementation – will be implemented later
    return None

