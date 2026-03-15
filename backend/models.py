from pydantic import BaseModel
from typing import Optional

class Location(BaseModel):
    lat: float
    lng: float

class MacroFilters(BaseModel):
    protein_min: Optional[float] = None
    protein_max: Optional[float] = None
    carbs_min: Optional[float] = None
    carbs_max: Optional[float] = None
    fat_min: Optional[float] = None
    fat_max: Optional[float] = None
    calories_min: Optional[float] = None
    calories_max: Optional[float] = None
    max_price: Optional[float] = None
    preferred_venue_types: Optional[list[str]] = None  # ["restaurant","fast_food","grocery"]
    sort_by: Optional[str] = None  # "score", "protein", "price"

class SearchRequest(BaseModel):
    location: Location
    radius_meters: int = 1500
    filters: MacroFilters = MacroFilters()  # ← default so frontend doesn't HAVE to send it

class Macros(BaseModel):
    protein_g: float
    carbs_g: float
    fat_g: float
    calories: float

class MealResult(BaseModel):
    meal_name: str
    restaurant_name: str
    address: str
    location: Location
    macros: Macros
    price: Optional[float] = None        # ← float not str
    priority_tier: int
    match_score: float
    distance_m: Optional[float] = None   # ← NEW
    venue_type: Optional[str] = None     # ← NEW
    match_reasons: Optional[list[str]] = None  # ← NEW

class SearchResponse(BaseModel):        # ← NEW
    results: list[MealResult]
