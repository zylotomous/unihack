export interface MealResult {
  meal_name: string
  restaurant_name: string
  address: string
  location: { lat: number; lng: number }
  macros: {
    protein_g: number
    carbs_g: number
    fat_g: number
    calories: number
  }
  price: number | null
  priority_tier: number
  match_score: number
  distance_m: number | null
  venue_type: string | null
  match_reasons: string[] | null
}

export async function searchMeals(
  lat: number,
  lng: number,
  filters: {
    protein_min?: number
    fat_max?: number
    calories_max?: number
    max_price?: number
  }
): Promise<MealResult[]> {
  const res = await fetch('http://localhost:8000/api/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      location: { lat, lng },
      radius_meters: 2000,
      filters: {
        protein_min: filters.protein_min || null,
        fat_max: filters.fat_max || null,
        calories_max: filters.calories_max || null,
        max_price: filters.max_price || null,
      },
    }),
  })
  const data = await res.json()
  return data.results
}
