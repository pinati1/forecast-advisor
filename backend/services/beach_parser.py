from models import Beach
from typing import List

def parse_beaches(location: str) -> List[Beach]:
    return []
    
def parse_beach(beach: str) -> Beach:
    return Beach(
        name=beach.name,
        location=beach.location,
        latitude=beach.latitude,
        longitude=beach.longitude,
        country=beach.country,
        city=beach.city
    )