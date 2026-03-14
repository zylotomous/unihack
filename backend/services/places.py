import httpx
import os
from services.nutrition import get_all_known_restaurants

KNOWN_CHAINS = get_all_known_restaurants()

async def get_nearby_restaurants(lat: float, lng: float, radius: int):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")

    # If no API key yet, return hardcoded locations for demo
    if not api_key or api_key == "your_key_here":
        return get_demo_restaurants(lat, lng)

    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location"
    }
    body = {
        "includedTypes": ["restaurant", "fast_food_restaurant"],
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius)
            }
        }
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, json=body, headers=headers)

    places = resp.json().get("places", [])
    return [
        {
            "name": p["displayName"]["text"],
            "address": p.get("formattedAddress", ""),
            "lat": p["location"]["latitude"],
            "lng": p["location"]["longitude"],
        }
        for p in places
    ]

def get_demo_restaurants(lat: float, lng: float):
    """Fallback demo data near the user's location for testing without API key"""
    import random
    results = []
    for name in KNOWN_CHAINS:
        # Scatter them slightly around the given location
        results.append({
            "name": name.title(),
            "address": f"Near {lat:.3f}, {lng:.3f}",
            "lat": lat + random.uniform(-0.01, 0.01),
            "lng": lng + random.uniform(-0.01, 0.01),
        })
    return results