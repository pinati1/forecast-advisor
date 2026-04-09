from typing import Optional, List
from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query, Request
from services.geo_service import get_closest_beach_real_distance

from models.beach import Beach
from services.condition_service import get_surf_conditions

router = APIRouter(prefix="/beaches", tags=["beaches"])


@router.get("")
async def get_beaches(location: Optional[str] = None) -> Optional[List[Beach]]:
    return None


@router.get("/{beach_id}")
async def get_beach(beach_id: str) -> Optional[Beach]:
    return None


router = APIRouter(prefix="/beaches", tags=["Beaches"])

@router.get("/closest")
async def find_closest_beach(
    request: Request,  # <-- This gives us access to the global app state!
    lat: float = Query(..., description="The latitude of the user's current location"),
    lng: float = Query(..., description="The longitude of the user's current location")
):
    try:
        db_handler = request.app.state.db
        
        closest_beach = await get_closest_beach_real_distance(
            db_handler=db_handler, 
            user_lat=lat, 
            user_lng=lng
        )
        
        if not closest_beach:
            raise HTTPException(status_code=404, detail="No beaches found in the database.")
            
        if "_id" in closest_beach:
            closest_beach["_id"] = str(closest_beach["_id"])
            
        return closest_beach

    except Exception as e:
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

       
        geometry = beach_data.get("geometry", {})
        coords = geometry.get("coordinates", [])

        if len(coords) < 2:
       
            lat = beach_data.get("lat")
            lng = beach_data.get("lng")
        else:
       
            lng = coords[0]
            lat = coords[1]
        
        if lat is None or lng is None:
            raise HTTPException(status_code=400, detail="Could not find coordinates in beach record")
       
        current_beach_condition = get_surf_conditions(
            beach_id=beach_id,
            lat=lat,
            lng=lng
        )

        return current_beach_condition

    except Exception as e:
        print(f"Error in /condition: {e}") 
        raise HTTPException(status_code=500, detail=str(e))