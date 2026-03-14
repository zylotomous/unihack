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
    calories_max: Optional[float] = None

class SearchRequest(BaseModel):
    location: Location
    radius_meters: int = 1500
    filters: MacroFilters

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
    price: Optional[str] = None
    priority_tier: int       # 1=restaurant, 2=fast food, 3=grocery
    match_score: float       # 0.0 - 1.0
