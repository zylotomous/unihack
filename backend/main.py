from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import SearchRequest, MealResult
from services.places import get_nearby_restaurants
from services.nutrition import get_nutrition_for_restaurant
from services.ranking import passes_filters, compute_match_score, get_priority_tier
import asyncio

app = FastAPI(title="MacroMap API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {"status": "ok"}

@app.post("/api/search")
async def search(req: SearchRequest):
    # 1. Get nearby restaurants
    restaurants = await get_nearby_restaurants(
        req.location.lat, req.location.lng, req.radius_meters
    )
    
    # 2. Query nutrition for each restaurant (parallel)
    nutrition_tasks = [
        get_nutrition_for_restaurant(r["name"]) for r in restaurants
    ]
    all_nutrition = await asyncio.gather(*nutrition_tasks)
    
    # 3. Filter + score
    results = []
    for restaurant, meals in zip(restaurants, all_nutrition):
        for meal in meals:
            if not passes_filters(meal, req.filters):
                continue
            results.append({
                "meal_name": meal["meal_name"],
                "restaurant_name": restaurant["name"],
                "address": restaurant["address"],
                "location": {"lat": restaurant["lat"], "lng": restaurant["lng"]},
                "macros": {
                    "protein_g": meal["protein_g"],
                    "carbs_g": meal["carbs_g"],
                    "fat_g": meal["fat_g"],
                    "calories": meal["calories"],
                },
                "price": None,
                "priority_tier": get_priority_tier(restaurant["name"]),
                "match_score": compute_match_score(meal, req.filters),
            })
    
    # 4. Sort: priority tier first, then match score
    results.sort(key=lambda x: (x["priority_tier"], -x["match_score"]))
    
    return {"results": results[:50]}  # cap response size

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)