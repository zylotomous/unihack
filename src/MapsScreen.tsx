import { useState, useEffect } from 'react'
import type { Filters } from './App'
import magglassSvg from './assets/magglass.svg'
import filterSvg from './assets/filters.svg'
import type { MealResult } from './api'

// Use relative /api when no VITE_API_URL (Vite proxy forwards to backend)
const API_BASE = import.meta.env.VITE_API_URL ?? ''

// Default location (UNSW) when geolocation unavailable
const DEFAULT_LOC = { lat: -33.9173, lng: 151.2313 }

interface MapsScreenProps {
  filters: Filters
  onOpenPresets: () => void
  onClearFilters: () => void
}

export default function MapsScreen({ filters, onOpenPresets, onClearFilters }: MapsScreenProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<MealResult[]>([])
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState(DEFAULT_LOC)

  const hasFilters = Object.values(filters).some(v => v !== '')

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {} // keep default on deny
    )
  }, [])

  useEffect(() => {
    let cancelled = false
    async function fetchResults() {
      setLoading(true)
      try {
        const res = await fetch(`${API_BASE}/api/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location,
            radius_meters: 1500,
            filters: {
              protein_min: filters.protein ? Number(filters.protein) : null,
              fat_max: filters.fat ? Number(filters.fat) : null,
              calories_max: filters.calories ? Number(filters.calories) : null,
              max_price: filters.budget ? Number(filters.budget) : null,
            },
          }),
        })
        const data = await res.json()
        if (!cancelled) setResults(data.results ?? [])
      } catch (err) {
        console.error('Search failed:', err)
        if (!cancelled) setResults([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResults()
    return () => { cancelled = true }
  }, [location.lat, location.lng, filters.protein, filters.fat, filters.calories, filters.budget])

  const filtered = query.trim() === ''
    ? results
    : results.filter(
        (m) =>
          m.meal_name.toLowerCase().includes(query.toLowerCase()) ||
          m.restaurant_name.toLowerCase().includes(query.toLowerCase())
      )

  return (
    <div className="maps-screen">

      {/* ── Search Bar ── */}
      <div className="search-bar">
        <span className="search-icon">
          <img src={magglassSvg} alt="search" width={20} height={20} />
        </span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search a specific restaurant here"
          className="search-input"
        />
        <button
          className={`filter-btn${hasFilters ? ' filter-btn--active' : ''}`}
          onClick={onOpenPresets}
        >
          <img src={filterSvg} alt="filter" width={24} height={24} />
        </button>
      </div>

      {/* ── Active Filter Chips ── */}
      {hasFilters && (
        <div className="filter-chips">
          {filters.protein && <span className="filter-chip">Protein: {filters.protein}g</span>}
          {filters.fat && <span className="filter-chip">Fat: {filters.fat}g</span>}
          {filters.calories && <span className="filter-chip">Cal: {filters.calories}</span>}
          {filters.budget && <span className="filter-chip">Budget: ${filters.budget}</span>}
          <button className="filter-chip filter-chip--clear" onClick={onClearFilters}>✕ Clear</button>
        </div>
      )}

      {/* ── Map Area — backend will implement ── */}
      <div className="maps-map-placeholder">
        {loading ? <span>Searching nearby meals…</span> : <span>Map loading…</span>}
      </div>

      {/* ── Scrollable Results (from backend) ── */}
      <div className="maps-results">
        {loading && <p className="loading-text">Finding meals near you…</p>}
        {!loading && filtered.length === 0 && (
          <p className="empty-state">No meals found. Try relaxing your filters or moving to a new area.</p>
        )}
        {!loading && filtered.map((m, i) => (
          <div key={`${m.restaurant_name}-${m.meal_name}-${i}`} className="result-card">
            <div className="result-img-placeholder" />
            <div className="result-info">
              <span className="result-name">{m.meal_name}</span>
              <span className="result-meta">
                {m.restaurant_name}
                {m.distance_m != null && ` · ${m.distance_m.toFixed(0)}m`}
                {m.price != null && ` · $${m.price.toFixed(2)}`}
              </span>
              <span className="result-macros">
                P: {m.macros.protein_g}g &nbsp;|&nbsp; F: {m.macros.fat_g}g &nbsp;|&nbsp; Cal: {m.macros.calories}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
