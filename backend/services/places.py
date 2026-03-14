import httpx
import os

KNOWN_CHAINS = [
    "mcdonald's",
    "kfc",
    "subway",
    "guzman y gomez",
    "nandos",
    "boost juice",
    "woolworths",
    "coles",
    "aldi",
    "hungry jack's",
    "domino's",
    "the wholesome kitchen",
]



async def get_nearby_restaurants(lat: float, lng: float, radius: int):
    api_key = os.getenv("GOOGLE_PLACES_API_KEY")

    # 1. If no API key yet, return hardcoded locations for demo
    if not api_key or api_key == "your_key_here":
        return get_demo_restaurants(lat, lng)

    url = "https://places.googleapis.com/v1/places:searchNearby"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": api_key,
        "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.location",
    }
    body = {
        "includedTypes": ["restaurant", "fast_food_restaurant"],
        "locationRestriction": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(radius),
            }
        },
    }

    try:
        # 2. Do the risky network call inside try
        async with httpx.AsyncClient() as client:
            resp = await client.post(url, json=body, headers=headers, timeout=5.0)

        # 3. If HTTP status is not 2xx, raise an error → jumps to except
        resp.raise_for_status()

        # 4. Parse JSON safely
        data = resp.json()
        places = data.get("places", [])

        # 5. Map raw Google response → our simple dict shape
        return [
            {
                "name": p["displayName"]["text"],
                "address": p.get("formattedAddress", ""),
                "lat": p["location"]["latitude"],
                "lng": p["location"]["longitude"],
            }
            for p in places
        ]

    except Exception:
        # 6. ANY error above (network, bad key, weird JSON) falls back here
        #    → demo data so your app still works
        return get_demo_restaurants(lat, lng)

def get_demo_restaurants(lat: float, lng: float) -> list[dict]:
    # Fixed offsets so results are deterministic (same input = same output every time)
    OFFSETS = [
        (0.003,  0.002),
        (-0.002, 0.004),
        (0.005, -0.001),
        (-0.004, -0.003),
        (0.001,  0.006),
        (-0.006,  0.002),
        (0.004, -0.004),
        (-0.001,  0.005),
        (0.007,  0.001),
        (-0.003, -0.005),
        (0.002,  0.007),
        (-0.005,  0.003),
    ]
    results = []
    for i, name in enumerate(KNOWN_CHAINS):
        dlat, dlng = OFFSETS[i % len(OFFSETS)]
        results.append({
            "name": name,
            "address": f"{name.title()}, near {lat:.3f}, {lng:.3f}",
            "lat": lat + dlat,
            "lng": lng + dlng,
        })
    return results

