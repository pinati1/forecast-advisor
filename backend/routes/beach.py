from typing import Optional, List

from fastapi import APIRouter

from models.beach import Beach


router = APIRouter(prefix="/beaches", tags=["beaches"])


@router.get("")
async def get_beaches(location: Optional[str] = None) -> Optional[List[Beach]]:
    # Skeleton implementation – will be implemented later
    return None


@router.get("/{beach_id}")
async def get_beach(beach_id: str) -> Optional[Beach]:
    # Skeleton implementation – will be implemented later
    return None

from fastapi import APIRouter, HTTPException, Query, Request
from services.geo_service import get_closest_beach_real_distance

# Set up the router. The prefix means this router handles anything under /beaches
router = APIRouter(prefix="/beaches", tags=["Beaches"])

@router.get("/closest")
async def find_closest_beach(
    request: Request,  # <-- This gives us access to the global app state!
    lat: float = Query(..., description="The latitude of the user's current location"),
    lng: float = Query(..., description="The longitude of the user's current location")
):
    try:
        # 1. Grab the live database connection we opened in main.py
        db_handler = request.app.state.db
        
        # 2. Pass the handler and the coordinates down into your pure service
        closest_beach = await get_closest_beach_real_distance(
            db_handler=db_handler, 
            user_lat=lat, 
            user_lng=lng
        )
        
        # 3. Handle the edge case where the database is empty
        if not closest_beach:
            raise HTTPException(status_code=404, detail="No beaches found in the database.")
            
        # 4. Handle MongoDB's ObjectId (FastAPI can't serialize ObjectId to JSON natively)
        if "_id" in closest_beach:
            closest_beach["_id"] = str(closest_beach["_id"])
            
        return closest_beach

    except Exception as e:
        # Catch any unexpected errors and return a clean 500 error
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")