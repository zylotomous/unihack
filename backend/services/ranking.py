def passes_filters(macros: dict, filters) -> bool:
    """Return True if meal meets all macro constraints"""
    if filters.protein_min and macros["protein_g"] < filters.protein_min:
        return False
    if filters.protein_max and macros["protein_g"] > filters.protein_max:
        return False
    if filters.carbs_max and macros["carbs_g"] > filters.carbs_max:
        return False
    if filters.fat_min and macros["fat_g"] < filters.fat_min:
        return False
    if filters.fat_max and macros["fat_g"] > filters.fat_max:
        return False
    if filters.calories_max and macros["calories"] > filters.calories_max:
        return False
    return True

def compute_match_score(macros: dict, filters) -> float:
    """Score 0-1 based on how well macros match filters (higher = better)"""
    score = 1.0
    
    # Reward higher protein over minimum
    if filters.protein_min and macros["protein_g"] > 0:
        ratio = macros["protein_g"] / filters.protein_min
        score *= min(ratio, 1.5) / 1.5  # cap bonus at 50% over target
    
    # Penalise excess carbs if there's a cap
    if filters.carbs_max and macros["carbs_g"] > 0:
        ratio = macros["carbs_g"] / filters.carbs_max
        score *= (1 - max(0, ratio - 0.8))  # small penalty as you approach limit

    if filters.fat_max and macros["fat_g"] > 0:
        ratio = macros["fat_g"] / filters.fat_max
        score *= (1 - max(0, ratio - 0.8))  # small penalty as you approach limit
    
    return round(min(score, 1.0), 3)

def get_priority_tier(restaurant_name: str) -> int:
    FAST_FOOD = ["mcdonald", "kfc", "subway", "hungry jack", "guzman", "nando"]
    GROCERY = ["woolworths", "coles", "aldi", "iga"]
    name_lower = restaurant_name.lower()
    if any(f in name_lower for f in FAST_FOOD):
        return 2
    if any(g in name_lower for g in GROCERY):
        return 3
    return 1  # independent restaurant = highest priority