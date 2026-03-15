import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import type { Filters } from './App'
import magglassSvg from './assets/magglass.svg'
import filterSvg from './assets/filters.svg'
import type { MealResult } from './api'

// Fix default marker icon in bundled apps
const DefaultIcon = L.divIcon({
  className: 'custom-marker',
  html: '<div style="background:#2563eb;width:20px;height:20px;border-radius:50%;border:2px solid white;box-shadow:0 1px 3px rgba(0,0,0,0.4)"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

function FitBounds({
  pins,
  userLoc,
}: {
  pins: { lat: number; lng: number }[]
  userLoc: { lat: number; lng: number }
}) {
  const map = useMap()
  useEffect(() => {
    if (pins.length === 0) {
      map.setView([userLoc.lat, userLoc.lng], 14)
      return
    }
    const points: [number, number][] = [
      ...pins.map((p): [number, number] => [p.lat, p.lng]),
      [userLoc.lat, userLoc.lng],
    ]
    const bounds = L.latLngBounds(points)
    map.fitBounds(bounds, { padding: [24, 24], maxZoom: 16 })
  }, [map, pins, userLoc.lat, userLoc.lng])
  return null
}

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

  // Group by location for unique pins (one pin per restaurant)
  const pins = useMemo(() => {
    const seen = new Set<string>()
    const out: { lat: number; lng: number; restaurant: string; meals: MealResult[] }[] = []
    for (const m of filtered) {
      const key = `${m.location.lat.toFixed(5)},${m.location.lng.toFixed(5)}`
      if (seen.has(key)) continue
      seen.add(key)
      const mealsHere = filtered.filter(
        (x) =>
          Math.abs(x.location.lat - m.location.lat) < 1e-5 &&
          Math.abs(x.location.lng - m.location.lng) < 1e-5
      )
      out.push({
        lat: m.location.lat,
        lng: m.location.lng,
        restaurant: m.restaurant_name,
        meals: mealsHere,
      })
    }
    return out
  }, [filtered])

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

      {/* ── Map with pins for matching restaurants ── */}
      <div className="maps-map-container">
        {loading ? (
          <div className="maps-map-overlay">
            <span>Searching nearby meals…</span>
          </div>
        ) : null}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={14}
          className="maps-map"
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitBounds
            pins={pins.map((p) => ({ lat: p.lat, lng: p.lng }))}
            userLoc={location}
          />
          {pins.map((p, i) => (
            <Marker
              key={`${p.lat}-${p.lng}-${i}`}
              position={[p.lat, p.lng]}
              icon={DefaultIcon}
            >
              <Popup>
                <div className="map-popup">
                  <strong>{p.restaurant}</strong>
                  <ul>
                    {p.meals.slice(0, 5).map((m, j) => (
                      <li key={j}>
                        {m.meal_name} — {m.macros.protein_g}g P · ${m.price?.toFixed(2) ?? '—'}
                      </li>
                    ))}
                    {p.meals.length > 5 && (
                      <li className="map-popup-more">+{p.meals.length - 5} more</li>
                    )}
                  </ul>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
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
