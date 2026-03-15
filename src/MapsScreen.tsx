import { useState } from 'react'
import type { Filters } from './App'
import magglassSvg from './assets/magglass.svg'
import filterSvg from './assets/filters.svg'

interface MapsScreenProps {
  filters: Filters
  onOpenPresets: () => void
  onClearFilters: () => void
}

// Placeholder restaurant data — backend will replace this
const PLACEHOLDER_RESULTS = [
  { id: 1, name: 'Restaurant name', rating: '4.5', dist: '0.3km', price: '$$' },
  { id: 2, name: 'Restaurant name', rating: '4.2', dist: '0.5km', price: '$' },
  { id: 3, name: 'Restaurant name', rating: '4.8', dist: '0.7km', price: '$$$' },
  { id: 4, name: 'Restaurant name', rating: '3.9', dist: '1.1km', price: '$$' },
  { id: 5, name: 'Restaurant name', rating: '4.6', dist: '1.4km', price: '$' },
  { id: 6, name: 'Restaurant name', rating: '4.1', dist: '1.8km', price: '$$' },
]

export default function MapsScreen({ filters, onOpenPresets, onClearFilters }: MapsScreenProps) {
  const [query, setQuery] = useState('')
  const hasFilters = Object.values(filters).some(v => v !== '')

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
        {/* TODO: drop in map component here (e.g. Leaflet / Google Maps) */}
        <span>Map loading…</span>
      </div>

      {/* ── Scrollable Results ── */}
      <div className="maps-results">
        {PLACEHOLDER_RESULTS.map(r => (
          <div key={r.id} className="result-card">
            <div className="result-img-placeholder" />
            <div className="result-info">
              <span className="result-name">{r.name}</span>
              <span className="result-meta">⭐ {r.rating} &nbsp;·&nbsp; {r.dist} &nbsp;·&nbsp; {r.price}</span>
              <span className="result-macros">P: — &nbsp;|&nbsp; F: — &nbsp;|&nbsp; Cal: —</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
