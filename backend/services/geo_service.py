import httpx
from typing import Optional, Dict, Any
from db import MongoHandler  # Import your handler
import os

# Grab the MongoDB connection details from your environment
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME")

# OSRM public API for driving distances
OSRM_BASE_URL = "http://router.project-osrm.org/table/v1/driving"

async def get_closest_beach_real_distance(user_lat: float, user_lng: float) -> Optional[Dict[str, Any]]:
    # Initialize your DB handler
    handler = MongoHandler(MONGO_URL, DB_NAME)
    collection = handler.db["beaches"]
    
    # --- STEP 1: Fast Aerial Filter using MongoDB ---
    pipeline = [
        {
            "$geoNear": {
                "near": {
                    "type": "Point",
                    "coordinates": [user_lng, user_lat]  # [Longitude, Latitude]
                },
                "distanceField": "aerial_distance",
                "spherical": True
            }
        },
        {"$limit": 5}
    ]
    
    # Run the aggregation pipeline
    candidate_beaches = list(collection.aggregate(pipeline))
    
    if not candidate_beaches:
        handler.close_connection()
        return None

    # --- STEP 2: Calculate Real Driving Distances ---
    coords_list = [f"{user_lng},{user_lat}"]
    
    for beach in candidate_beaches:
        # PULLING FROM YOUR NEW SCHEMA: beach["geometry"]["coordinates"]
        b_lng, b_lat = beach["geometry"]["coordinates"]
        coords_list.append(f"{b_lng},{b_lat}")
        
    coordinates_str = ";".join(coords_list)
    url = f"{OSRM_BASE_URL}/{coordinates_str}?sources=0&annotations=distance"
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, timeout=5.0)
            response.raise_for_status()
            data = response.json()
    except httpx.RequestError:
        handler.close_connection()
        return candidate_beaches[0]  # Fallback to aerial distance if OSRM fails
    
    # --- STEP 3: Sort by Real Distance ---
    distances = data.get("distances", [[]])[0]
    
    best_beach = None
    shortest_distance = float('inf')
    
    for i in range(1, len(distances)):
        dist = distances[i]
        if dist is not None and dist < shortest_distance:
            shortest_distance = dist
            best_beach = candidate_beaches[i - 1]
            
    handler.close_connection()

    if best_beach:
        best_beach["driving_distance_meters"] = shortest_distance
        return best_beach
        
    return candidate_beaches[0]