import asyncio
import math
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models import SearchRequest, SearchResponse, MealResult, Macros, Location
from services.places import get_nearby_restaurants
from services.nutrition import get_nutrition_for_restaurant
from services.ranking import passes_filters, compute_match_score, get_priority_tier

app = FastAPI(title="MacroMap API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to specific domain before final deploy
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def calc_distance_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Flat-earth distance approximation. Fine for city-scale distances."""
    dx = (lat1 - lat2) * 111_000
    dy = (lng1 - lng2) * 111_000 * math.cos(math.radians(lat1))
    return round((dx**2 + dy**2) ** 0.5, 1)

VENUE_TYPE_MAP = {1: "restaurant", 2: "fast_food", 3: "grocery"}

@app.get("/api/health")
async def health():
    return {"status": "ok"}

@app.post("/api/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    # Step 1: Get nearby restaurants (real API or demo fallback)
    restaurants = await get_nearby_restaurants(
        req.location.lat, req.location.lng, req.radius_meters
    )

    # Step 2: Get nutrition for all restaurants IN PARALLEL
    # asyncio.gather runs all lookups at the same time instead of one by one
    nutrition_tasks = [get_nutrition_for_restaurant(r["name"]) for r in restaurants]
    all_nutrition = await asyncio.gather(*nutrition_tasks)

    # Step 3: Filter, score, and build results
    results: list[MealResult] = []

    for restaurant, meals in zip(restaurants, all_nutrition):
        d = calc_distance_m(
            req.location.lat, req.location.lng,
            restaurant["lat"], restaurant["lng"]
        )
        tier = get_priority_tier(restaurant["name"])
        venue_type = VENUE_TYPE_MAP.get(tier, "restaurant")

        # Skip this restaurant if venue type not in user preference
        if req.filters.preferred_venue_types:
            if venue_type not in req.filters.preferred_venue_types:
                continue

        for meal in meals:
            # Skip if meal doesn't pass macro/price filters
            if not passes_filters(meal, req.filters):
                continue

            # Skip if meal exceeds max price
            if req.filters.max_price is not None and meal.get("price") is not None:
                if meal["price"] > req.filters.max_price:
                    continue

            score = compute_match_score(meal, req.filters)

            # Build human-readable reasons
            reasons: list[str] = []
            reasons.append(f"{meal['protein_g']}g protein")
            reasons.append(f"{meal['calories']} kcal")
            if meal.get("price"):
                reasons.append(f"${meal['price']:.2f}")
            reasons.append(f"{d:.0f}m away")
            reasons.append(f"Type: {venue_type}")

            results.append(MealResult(
                meal_name=meal["meal_name"],
                restaurant_name=restaurant["name"],
                address=restaurant["address"],
                location=Location(lat=restaurant["lat"], lng=restaurant["lng"]),
                macros=Macros(
                    protein_g=meal["protein_g"],
                    carbs_g=meal["carbs_g"],
                    fat_g=meal["fat_g"],
                    calories=meal["calories"],
                ),
                price=meal.get("price"),
                priority_tier=tier,
                match_score=score,
                distance_m=d,
                venue_type=venue_type,
                match_reasons=reasons,
            ))

    # Step 4: Sort results
    sort_by = req.filters.sort_by or "score"
    if sort_by == "protein":
        results.sort(key=lambda x: x.macros.protein_g, reverse=True)
    elif sort_by == "price":
        results.sort(key=lambda x: (x.price or 999))
    else:
        # Default: sort by tier first (restaurant > fast food > grocery), then score
        results.sort(key=lambda x: (x.priority_tier, -x.match_score))

    return SearchResponse(results=results[:50])
