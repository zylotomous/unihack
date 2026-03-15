import { useState, useEffect } from 'react'
import type { Filters } from './App'
import magglassSvg from './assets/magglass.svg'
import filterSvg from './assets/filters.svg'

// Placeholder favorites data - replace with /api/favs later
interface FavResult {
  id: number
  name: string
  restaurant: string
  rating: string
  dist: string
  price: string
  macros: string
}

const PLACEHOLDER_FAVS: FavResult[] = [
  { id: 1, name: 'Grilled Chicken Bowl', restaurant: 'HealthyHub Cafe', rating: '4.5', dist: '0.3km', price: '$$', macros: 'P: 45g | F: 12g | Cal: 520' },
  { id: 2, name: 'Salmon Poke', restaurant: 'Ocean Fresh', rating: '4.8', dist: '0.5km', price: '$', macros: 'P: 38g | F: 15g | Cal: 450' },
  { id: 3, name: 'Veggie Stir Fry', restaurant: 'GreenLeaf Asian', rating: '4.2', dist: '0.7km', price: '$$$', macros: 'P: 22g | F: 8g | Cal: 380' },
  { id: 4, name: 'Protein Shake', restaurant: 'FitFuel Bar', rating: '4.6', dist: '1.1km', price: '$', macros: 'P: 35g | F: 5g | Cal: 250' },
  { id: 5, name: 'Turkey Wrap', restaurant: 'QuickBite Deli', rating: '4.1', dist: '1.4km', price: '$$', macros: 'P: 28g | F: 10g | Cal: 420' },
]

interface FavsScreenProps {
  filters: Filters
  onOpenPresets: () => void
  onClearFilters: () => void
}

export default function FavsScreen({ filters, onOpenPresets, onClearFilters }: FavsScreenProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<FavResult[]>([])
  const [loading, setLoading] = useState(false)

  const hasFilters = Object.values(filters).some(v => v !== '')

  // Simulate API fetch for favorites
  useEffect(() => {
    let cancelled = false
    async function fetchFavs() {
      setLoading(true)
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))
      if (!cancelled) {
        setResults(PLACEHOLDER_FAVS)
      }
    }
    fetchFavs()
    return () => { cancelled = true }
  }, [])

  const filtered = query.trim() === ''
    ? results
    : results.filter(r =>
        r.name.toLowerCase().includes(query.toLowerCase()) ||
        r.restaurant.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div className="maps-screen">
      {/* Search Bar */}
      <div className="search-bar">
        <span className="search-icon">
          <img src={magglassSvg} alt="search" width={20} height={20} />
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search your favorites"
          className="search-input"
        />
        <button
          className={`filter-btn${hasFilters ? ' filter-btn--active' : ''}`}
          onClick={onOpenPresets}
          title="Filters (not applied to favorites)"
        >
          <img src={filterSvg} alt="filter" width={24} height={24} />
        </button>
      </div>

      {/* Filter Chips (show for consistency, but no-op on clear) */}
      {hasFilters && (
        <div className="filter-chips">
          {filters.protein && <span className="filter-chip">Protein: {filters.protein}g</span>}
          {filters.fat && <span className="filter-chip">Fat: {filters.fat}g</span>}
          {filters.calories && <span className="filter-chip">Cal: {filters.calories}</span>}
          {filters.budget && <span className="filter-chip">Budget: ${filters.budget}</span>}
          <button className="filter-chip filter-chip--clear" onClick={onClearFilters}>✕ Clear</button>
        </div>
      )}

      {/* Scrollable Results */}
      <div className="maps-results">
        {loading && <p className="loading-text">Loading your favorites…</p>}
        {!loading && filtered.length === 0 && (
          <p className="empty-state">No favorites yet. Save some from Explore or Maps!</p>
        )}
        {!loading && filtered.map(r => (
          <div key={r.id} className="result-card">
            <div className="result-img-placeholder" />
            <div className="result-info">
              <span className="result-name">{r.name}</span>
              <span className="result-meta">
                {r.restaurant} · {r.rating} ⭐ · {r.dist} · {r.price}
              </span>
              <span className="result-macros">{r.macros}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

