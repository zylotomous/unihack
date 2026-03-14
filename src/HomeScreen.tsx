import { useState, useEffect } from 'react'
import './App.css'
import logoSvg from './assets/logo.svg'
import profileSvg from './assets/pfp.svg'
import filterSvg from './assets/filters.svg'
import magglassSvg from './assets/magglass.svg'
import exploreSvg from './assets/explore.svg'
import mapsSvg from './assets/maps.svg'
import bookmarkSvg from './assets/favs.svg'
import offersSvg from './assets/offers.svg'

interface Filters {
  protein: string
  fat: string
  calories: string
  budget: string
}

interface Macros {
  protein_g: number
  carbs_g: number
  fat_g: number
  calories: number
}

interface MealResult {
  meal_name: string
  restaurant_name: string
  address: string
  macros: Macros
  price: number | null
  distance_m: number | null
  venue_type: string | null
  match_score: number
  match_reasons: string[] | null
}

const EMPTY_FILTERS: Filters = { protein: '', fat: '', calories: '', budget: '' }

const VENUE_COLOURS: Record<string, string> = {
  restaurant: '#4CAF50',
  fast_food: '#FF9800',
  grocery: '#2196F3',
}

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export default function HomeScreen() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>({
    lat: -33.9173,
    lng: 151.2313
  })
  const [locationError, setLocationError] = useState<string | null>(null)
  const [results, setResults] = useState<MealResult[]>([])
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState<'score' | 'protein' | 'price'>('score')
  const [searched, setSearched] = useState(false)
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setUserLocation({ lat: -33.9173, lng: 151.2313 })
        setLocationError('Location denied – using UNSW as default')
      }
    )
  }, [])

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  async function applyFilters() {
    if (!userLocation) return
    setShowFilters(false)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: userLocation,
          radius_meters: 1500,
          filters: {
            protein_min: filters.protein ? Number(filters.protein) : null,
            fat_max: filters.fat ? Number(filters.fat) : null,
            calories_max: filters.calories ? Number(filters.calories) : null,
            max_price: filters.budget ? Number(filters.budget) : null,
            sort_by: sortBy,
          },
        }),
      })
      const data = await res.json()
      setResults(data.results ?? [])
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setSearched(true)
      setLoading(false)
    }
  }

  const sorted = [...results].sort((a, b) => {
    if (sortBy === 'protein') return b.macros.protein_g - a.macros.protein_g
    if (sortBy === 'price') return (a.price ?? 999) - (b.price ?? 999)
    return b.match_score - a.match_score
  })

  const filtered = sorted.filter(m =>
    searchText === '' ||
    m.restaurant_name.toLowerCase().includes(searchText.toLowerCase()) ||
    m.meal_name.toLowerCase().includes(searchText.toLowerCase())
  )

  return (
    <div className="app">
      {/* ── Top Bar ── */}
      <header className="top-bar">
        <div className="logo"><img src={logoSvg} alt="logo" width={50} height={50} /></div>
        <div className="profile"><img src={profileSvg} alt="profile" width={40} height={40} /></div>
      </header>

      {locationError && <p className="location-warning">{locationError}</p>}

      {/* ── Search Bar ── */}
      <div className="search-bar">
        <span className="search-icon">
          <img src={magglassSvg} alt="search" width={20} height={20} />
        </span>
        <input
          type="text"
          placeholder="Search a specific restaurant here"
          className="search-input"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <button className={`filter-btn${showFilters ? ' filter-btn--active' : ''}`} onClick={() => setShowFilters(v => !v)}>
          <img src={filterSvg} alt="filter" width={24} height={24} />
        </button>
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-row">
            <label className="filter-label">Protein (g)
              <input type="number" name="protein" placeholder="any" value={filters.protein} onChange={handleFilterChange} className="filter-input" />
            </label>
            <label className="filter-label">Fat (g)
              <input type="number" name="fat" placeholder="any" value={filters.fat} onChange={handleFilterChange} className="filter-input" />
            </label>
          </div>
          <div className="filter-row">
            <label className="filter-label">Calories
              <input type="number" name="calories" placeholder="any" value={filters.calories} onChange={handleFilterChange} className="filter-input" />
            </label>
            <label className="filter-label">Budget ($)
              <input type="number" name="budget" placeholder="any" value={filters.budget} onChange={handleFilterChange} className="filter-input" />
            </label>
          </div>
          <button className="filter-apply-btn" onClick={applyFilters}>
            {loading ? 'Searching…' : 'Apply Filter'}
          </button>
        </div>
      )}

      {/* ── Sort Buttons + Result Count ── */}
      {results.length > 0 && (
        <div className="sort-bar">
          <span className="result-count">{filtered.length} results</span>
          {(['score', 'protein', 'price'] as const).map(opt => (
            <button
              key={opt}
              className={`sort-btn${sortBy === opt ? ' sort-btn--active' : ''}`}
              onClick={() => setSortBy(opt)}
            >
              {opt === 'score' ? 'Best Match' : opt.charAt(0).toUpperCase() + opt.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* ── Meal Cards ── */}
      <main className="results-list">
        {loading && <p className="loading-text">Finding meals near you…</p>}
        {!loading && searched && results.length === 0 && (
          <p className="empty-state">No meals found. Try relaxing your filters.</p>
        )}
        {!loading && filtered.map((meal, i) => (
          <div key={i} className="meal-card">
            <div className="meal-card-header">
              <span className="meal-name">{meal.meal_name}</span>
              {meal.venue_type && (
                <span
                  className="venue-badge"
                  style={{ backgroundColor: VENUE_COLOURS[meal.venue_type] ?? '#888' }}
                >
                  {meal.venue_type.replace('_', ' ')}
                </span>
              )}
            </div>
            <div className="meal-restaurant">{meal.restaurant_name}</div>
            <div className="meal-macros">
              <span>🥩 {meal.macros.protein_g}g protein</span>
              <span>🔥 {meal.macros.calories} kcal</span>
              <span>🧈 {meal.macros.fat_g}g fat</span>
              {meal.price != null && <span>💰 ${meal.price.toFixed(2)}</span>}
              {meal.distance_m != null && <span>📍 {meal.distance_m.toFixed(0)}m</span>}
            </div>
            {meal.match_reasons && (
              <div className="match-reasons">
                {meal.match_reasons.map((r, j) => <span key={j} className="reason-chip">{r}</span>)}
              </div>
            )}
          </div>
        ))}
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="bottom-nav">
        <button className="nav-item"><img src={exploreSvg} alt="explore" width={32} height={32} /><span>Explore</span></button>
        <button className="nav-item"><img src={mapsSvg} alt="maps" width={32} height={32} /><span>Maps</span></button>
        <button className="nav-item nav-item--active"><img src={bookmarkSvg} alt="saved" width={32} height={32} /><span>Saved</span></button>
        <button className="nav-item"><img src={offersSvg} alt="offers" width={32} height={32} /><span>Offers</span></button>
      </nav>
    </div>
  )
}
