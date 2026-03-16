
from pydantic import BaseModel


class Beach(BaseModel):
    id: str 
    name: str
    location: str
    latitude: float
    longitude: float
    country: str
    city: str