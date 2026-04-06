from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, Request
from services.geo_service import get_closest_beach_real_distance

from models.beach import Beach
from services.condition_service import get_surf_conditions

router = APIRouter(prefix="/beaches", tags=["beaches"])


@router.get("")
async def get_beaches(location: Optional[str] = None) -> Optional[List[Beach]]:
    # Skeleton implementation – will be implemented later
    return None


@router.get("/{beach_id}")
async def get_beach(beach_id: str) -> Optional[Beach]:
    # Skeleton implementation – will be implemented later
    return None


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


@router.get("/condition")
async def get_beach_condition(
    request: Request,
    beach_id: str = Query(..., description="The ID of the beach to check")
  
):
    try: 
        db_handler = request.app.state.db
        beach_data =  db_handler.db["beaches"].find_one({"_id": ObjectId(beach_id)})
        
        if not beach_data:
            raise HTTPException(status_code=404, detail="Beach not found")

        # --- UPDATED COORDINATE EXTRACTION ---
        # Look inside the geometry object seen in your screenshot
        geometry = beach_data.get("geometry", {})
        coords = geometry.get("coordinates", [])

        if len(coords) < 2:
            # Fallback: check if maybe they are at the top level
            lat = beach_data.get("lat")
            lng = beach_data.get("lng")
        else:
            # GeoJSON index 0 is Longitude, index 1 is Latitude
            lng = coords[0]
            lat = coords[1]
        
        if lat is None or lng is None:
            raise HTTPException(status_code=400, detail="Could not find coordinates in beach record")
        # --------------------------------------

        current_beach_condition = get_surf_conditions(
            beach_id=beach_id,
            lat=lat,
            lng=lng
        )

        return current_beach_condition

    except Exception as e:
        print(f"Error in /condition: {e}") # This shows in your terminal
        raise HTTPException(status_code=500, detail=str(e))