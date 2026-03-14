NUTRITION_DB = {
    "mcdonald's": [
        {"meal_name": "McChicken", "protein_g": 14, "carbs_g": 40, "fat_g": 17, "calories": 410, "price": 8.50},
        {"meal_name": "Big Mac", "protein_g": 25, "carbs_g": 46, "fat_g": 30, "calories": 550, "price": 10.95},
        {"meal_name": "Grilled Chicken Wrap", "protein_g": 28, "carbs_g": 35, "fat_g": 12, "calories": 380, "price": 9.50},
        {"meal_name": "Quarter Pounder", "protein_g": 30, "carbs_g": 42, "fat_g": 26, "calories": 520, "price": 11.50},
    ],
    "kfc": [
        {"meal_name": "Zinger Burger", "protein_g": 28, "carbs_g": 44, "fat_g": 20, "calories": 490, "price": 11.95},
        {"meal_name": "3 Piece Original", "protein_g": 45, "carbs_g": 15, "fat_g": 28, "calories": 490, "price": 14.50},
        {"meal_name": "Popcorn Chicken (large)", "protein_g": 30, "carbs_g": 22, "fat_g": 18, "calories": 390, "price": 10.95},
        {"meal_name": "Twister Wrap", "protein_g": 24, "carbs_g": 38, "fat_g": 14, "calories": 420, "price": 10.50},
    ],
    "subway": [
        {"meal_name": "Chicken Teriyaki Footlong", "protein_g": 42, "carbs_g": 70, "fat_g": 8, "calories": 540, "price": 16.50},
        {"meal_name": "Steak & Cheese Footlong", "protein_g": 38, "carbs_g": 68, "fat_g": 14, "calories": 580, "price": 17.50},
        {"meal_name": "Turkey Breast Footlong", "protein_g": 36, "carbs_g": 66, "fat_g": 5, "calories": 480, "price": 15.50},
        {"meal_name": "Tuna Footlong", "protein_g": 28, "carbs_g": 64, "fat_g": 18, "calories": 550, "price": 14.50},
    ],
    "guzman y gomez": [
        {"meal_name": "Grilled Chicken Burrito", "protein_g": 48, "carbs_g": 65, "fat_g": 14, "calories": 620, "price": 17.50},
        {"meal_name": "Naked Burrito Bowl", "protein_g": 44, "carbs_g": 50, "fat_g": 12, "calories": 500, "price": 16.50},
        {"meal_name": "Grilled Chicken Tacos (3)", "protein_g": 36, "carbs_g": 42, "fat_g": 10, "calories": 430, "price": 15.50},
    ],
    "nandos": [
        {"meal_name": "1/4 Chicken", "protein_g": 32, "carbs_g": 2, "fat_g": 8, "calories": 220, "price": 14.50},
        {"meal_name": "1/2 Chicken", "protein_g": 60, "carbs_g": 4, "fat_g": 16, "calories": 420, "price": 22.50},
        {"meal_name": "Chicken Burger", "protein_g": 35, "carbs_g": 44, "fat_g": 18, "calories": 510, "price": 16.50},
    ],
    "boost juice": [
        {"meal_name": "Mango Magic (large)", "protein_g": 6, "carbs_g": 72, "fat_g": 2, "calories": 340, "price": 11.50},
        {"meal_name": "Protein Hit (large)", "protein_g": 22, "carbs_g": 42, "fat_g": 5, "calories": 310, "price": 12.50},
    ],
    "woolworths": [
        {"meal_name": "Roast Chicken (whole)", "protein_g": 80, "carbs_g": 0, "fat_g": 30, "calories": 620, "price": 12.00},
        {"meal_name": "Greek Yoghurt 500g", "protein_g": 40, "carbs_g": 28, "fat_g": 8, "calories": 340, "price": 5.50},
        {"meal_name": "Tuna Can 425g", "protein_g": 38, "carbs_g": 0, "fat_g": 4, "calories": 190, "price": 3.50},
    ],
    "coles": [
        {"meal_name": "Roast Chicken (whole)", "protein_g": 80, "carbs_g": 0, "fat_g": 30, "calories": 620, "price": 11.00},
        {"meal_name": "Protein Bar (box of 6)", "protein_g": 20, "carbs_g": 24, "fat_g": 10, "calories": 260, "price": 14.00},
    ],
    "aldi": [
        {"meal_name": "Roast Chicken (whole)", "protein_g": 80, "carbs_g": 0, "fat_g": 28, "calories": 600, "price": 9.99},
        {"meal_name": "Chocolate Protein Bar", "protein_g": 20, "carbs_g": 20, "fat_g": 8, "calories": 240, "price": 2.49},
    ],
    "hungry jack's": [
        {"meal_name": "Whopper", "protein_g": 27, "carbs_g": 48, "fat_g": 32, "calories": 610, "price": 10.95},
        {"meal_name": "Grilled Chicken Burger", "protein_g": 30, "carbs_g": 42, "fat_g": 12, "calories": 420, "price": 9.95},
    ],
    "default": [
        {"meal_name": "Grilled Chicken Salad", "protein_g": 35, "carbs_g": 15, "fat_g": 8, "calories": 320, "price": 14.00},
        {"meal_name": "Beef Rice Bowl", "protein_g": 30, "carbs_g": 55, "fat_g": 12, "calories": 480, "price": 13.50},
        {"meal_name": "Tuna Pasta", "protein_g": 28, "carbs_g": 50, "fat_g": 6, "calories": 400, "price": 12.00},
    ],
}

# ← THIS IS THE CRITICAL FIX: must be "async def" not "def"
async def get_nutrition_for_restaurant(restaurant_name: str) -> list[dict]:
    name_lower = restaurant_name.lower()
    for key, meals in NUTRITION_DB.items():
        if key in name_lower or name_lower in key:
            return meals
    return NUTRITION_DB["default"]
