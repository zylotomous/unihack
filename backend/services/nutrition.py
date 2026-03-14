# Hardcoded nutrition data for Australian restaurants/fast food chains
# Format: restaurant name (lowercase) → list of menu items with macros

NUTRITION_DB = {
    "mcdonald's": [
        {"meal_name": "McChicken", "protein_g": 14, "carbs_g": 40, "fat_g": 2, "calories": 350},
        {"meal_name": "Big Mac", "protein_g": 25, "carbs_g": 46, "fat_g": 3, "calories": 550},
        {"meal_name": "Grilled Chicken Salad", "protein_g": 30, "carbs_g": 8, "fat_g": 4, "calories": 220},
        {"meal_name": "Quarter Pounder", "protein_g": 30, "carbs_g": 43, "fat_g": 3, "calories": 520},
    ],
    "kfc": [
        {"meal_name": "Original Recipe Chicken (2 pcs)", "protein_g": 38, "carbs_g": 12, "fat_g": 1, "calories": 390},
        {"meal_name": "Zinger Burger", "protein_g": 28, "carbs_g": 48, "fat_g": 3, "calories": 490},
        {"meal_name": "Grilled Chicken Twister", "protein_g": 35, "carbs_g": 38, "fat_g": 4, "calories": 420},
        {"meal_name": "Popcorn Chicken (large)", "protein_g": 22, "carbs_g": 30, "fat_g": 1, "calories": 380},
    ],
    "subway": [
        {"meal_name": "6\" Chicken Teriyaki", "protein_g": 26, "carbs_g": 48, "fat_g": 4, "calories": 370},
        {"meal_name": "6\" Turkey Breast", "protein_g": 23, "carbs_g": 46, "fat_g": 4, "calories": 280},
        {"meal_name": "Footlong Tuna", "protein_g": 36, "carbs_g": 68, "fat_g": 6, "calories": 550},
        {"meal_name": "Footlong Chicken Classic", "protein_g": 52, "carbs_g": 70, "fat_g": 6, "calories": 640},
        {"meal_name": "6\" Veggie Delite", "protein_g": 9, "carbs_g": 44, "fat_g": 5, "calories": 230},
    ],
    "guzman y gomez": [
        {"meal_name": "Grilled Chicken Burrito", "protein_g": 48, "carbs_g": 55, "fat_g": 8, "calories": 580},
        {"meal_name": "Chicken Taco (x3)", "protein_g": 36, "carbs_g": 42, "fat_g": 6, "calories": 470},
        {"meal_name": "Naked Burrito Bowl - Chicken", "protein_g": 45, "carbs_g": 30, "fat_g": 9, "calories": 430},
        {"meal_name": "Grilled Chicken Quesadilla", "protein_g": 40, "carbs_g": 38, "fat_g": 4, "calories": 510},
    ],
    "hungry jack's": [
        {"meal_name": "Whopper", "protein_g": 28, "carbs_g": 52, "fat_g": 2, "calories": 650},
        {"meal_name": "Grilled Chicken Burger", "protein_g": 32, "carbs_g": 40, "fat_g": 3, "calories": 420},
        {"meal_name": "Bacon Deluxe", "protein_g": 35, "carbs_g": 44, "fat_g": 2, "calories": 590},
    ],
    "nando's": [
        {"meal_name": "1/4 Chicken (flame-grilled)", "protein_g": 42, "carbs_g": 0, "fat_g": 0, "calories": 300},
        {"meal_name": "1/2 Chicken (flame-grilled)", "protein_g": 68, "carbs_g": 0, "fat_g": 0, "calories": 490},
        {"meal_name": "Chicken Butterfly Burger", "protein_g": 44, "carbs_g": 42, "fat_g": 3, "calories": 520},
        {"meal_name": "Fino Pitta - Chicken", "protein_g": 38, "carbs_g": 35, "fat_g": 4, "calories": 440},
        {"meal_name": "Full Chicken (flame-grilled)", "protein_g": 115, "carbs_g": 0, "fat_g": 0, "calories": 890},
    ],
    "grill'd": [
        {"meal_name": "Simply Grill'd Beef", "protein_g": 42, "carbs_g": 38, "fat_g": 4, "calories": 540},
        {"meal_name": "Lean Chicken Burger", "protein_g": 45, "carbs_g": 36, "fat_g": 5, "calories": 480},
        {"meal_name": "Super Nutritious Hero", "protein_g": 38, "carbs_g": 40, "fat_g": 8, "calories": 510},
        {"meal_name": "Protein Hero (lettuce bun)", "protein_g": 48, "carbs_g": 10, "fat_g": 5, "calories": 380},
    ],
    "zambrero": [
        {"meal_name": "Chicken Burrito", "protein_g": 44, "carbs_g": 58, "fat_g": 9, "calories": 590},
        {"meal_name": "Chicken Burrito Bowl", "protein_g": 42, "carbs_g": 35, "fat_g": 10, "calories": 460},
        {"meal_name": "Chicken Tacos (x3)", "protein_g": 35, "carbs_g": 45, "fat_g": 7, "calories": 480},
    ],
    "domino's": [
        {"meal_name": "Chicken & Veg Pizza (2 slices)", "protein_g": 22, "carbs_g": 44, "fat_g": 3, "calories": 420},
        {"meal_name": "BBQ Meatlovers (2 slices)", "protein_g": 28, "carbs_g": 46, "fat_g": 2, "calories": 520},
    ],
    "boost juice": [
        {"meal_name": "Mango Magic (original)", "protein_g": 8, "carbs_g": 62, "fat_g": 5, "calories": 320},
        {"meal_name": "Gym Junkie Smoothie", "protein_g": 28, "carbs_g": 40, "fat_g": 6, "calories": 380},
        {"meal_name": "Passion Mango (original)", "protein_g": 6, "carbs_g": 58, "fat_g": 4, "calories": 290},
    ],
    "sushi hub": [
        {"meal_name": "Salmon Sashimi (6 pcs)", "protein_g": 28, "carbs_g": 0, "fat_g": 0, "calories": 180},
        {"meal_name": "Chicken Teriyaki Roll (8 pcs)", "protein_g": 22, "carbs_g": 48, "fat_g": 2, "calories": 360},
        {"meal_name": "Tuna Avocado Roll (8 pcs)", "protein_g": 20, "carbs_g": 44, "fat_g": 3, "calories": 330},
    ],
    "roll'd": [
        {"meal_name": "Lemongrass Chicken Rice Paper Roll (x3)", "protein_g": 24, "carbs_g": 30, "fat_g": 4, "calories": 310},
        {"meal_name": "Pork & Prawn Rice Paper Roll (x3)", "protein_g": 20, "carbs_g": 28, "fat_g": 3, "calories": 280},
        {"meal_name": "Chicken Pho (large)", "protein_g": 38, "carbs_g": 52, "fat_g": 3, "calories": 460},
    ],
}

def get_nutrition_for_restaurant(restaurant_name: str):
    """
    Look up hardcoded nutrition data for a restaurant.
    Does a fuzzy match on the restaurant name.
    """
    name_lower = restaurant_name.lower()

    # Try to find a matching key in our DB
    for key, meals in NUTRITION_DB.items():
        if key in name_lower or name_lower in key:
            return meals

    # No match found - return empty
    return []

def get_all_known_restaurants():
    """Return list of all restaurant names we have data for"""
    return list(NUTRITION_DB.keys())