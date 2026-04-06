import requests
from datetime import datetime, timedelta

# 1. THE CACHE (Our Primary Key Dictionary)
# This will store data in memory so we don't spam the Open-Meteo API
surf_conditions_cache = {}

def calculate_wave_quality(height_meters, period_seconds):
    """
    Our custom algorithm to determine if the surf is good.
    Longer periods and higher waves generally mean better surfing.
    """
    if height_meters >= 1.5 and period_seconds >= 8:
        return "Epic"
    elif height_meters >= 1.0 and period_seconds >= 6:
        return "Good"
    elif height_meters >= 0.5:
        return "Fair"
    else:
        return "Poor"

def get_surf_conditions(beach_id, lat, lng):
    now = datetime.now()

    # 2. CHECK THE CACHE
    # If we have data for this beach, and it's less than 1 hour old, use it!
    if beach_id in surf_conditions_cache:
        cached_data = surf_conditions_cache[beach_id]
        if now - cached_data['timestamp'] < timedelta(hours=1):
            print(f"⚡ Using cached surf data for {beach_id}")
            return cached_data['data']

    # 3. NO CACHE? CALL THE API
    print(f"🌊 Fetching fresh data from Open-Meteo for {beach_id}")
    url = "https://marine-api.open-meteo.com/v1/marine"
    params = {
        "latitude": lat,
        "longitude": lng,
        "current": "wave_height,wave_period",
        "timezone": "auto"
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status() # Throws an error if the API fails
        data = response.json()
        
        print(f"DEBUG: Full Response: {response.json()}") # Look at this!
        # Safely extract the data (default to 0 if missing)
        current_weather = data.get("current", {})
        wave_height = current_weather.get("wave_height", 0)
        wave_period = current_weather.get("wave_period", 0)

        # 4. RUN THE ALGORITHM
        quality = calculate_wave_quality(wave_height, wave_period)

        # 5. PACKAGE THE DATA
        surf_data = {
            "wave_height": wave_height,
            "wave_period": wave_period,
            "quality": quality
        }

        # 6. SAVE TO CACHE FOR NEXT TIME
        surf_conditions_cache[beach_id] = {
            "timestamp": now,
            "data": surf_data
        }

        return surf_data

    except Exception as e:
        print(f"❌ Error fetching weather for {beach_id}: {e}")
        # If the API crashes, return safe fallback data so the app doesn't break
        return {"wave_height": 0, "wave_period": 0, "quality": "Unknown"}