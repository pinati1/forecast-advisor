from pydantic import BaseModel
from typing import Literal, Tuple


class GeoPoint(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: Tuple[float, float] 

class Beach(BaseModel):
    id: str 
    name: str
    location: str
    geometry: GeoPoint  
    country: str
    city: str