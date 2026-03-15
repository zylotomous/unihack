// import { useState } from 'react'
// import type { Filters } from './App'
// import magglassSvg from './assets/magglass.svg'
// import filterSvg from './assets/filters.svg'

// Placeholder restaurant data — backend will replace this
const PLACEHOLDER_RESULTS = [
  { id: 1, name: 'Restaurant name', rating: '4.5', dist: '0.3km', price: '$$' },
  { id: 2, name: 'Restaurant name', rating: '4.2', dist: '0.5km', price: '$' },
  { id: 3, name: 'Restaurant name', rating: '4.8', dist: '0.7km', price: '$$$' },
  { id: 4, name: 'Restaurant name', rating: '3.9', dist: '1.1km', price: '$$' },
  { id: 5, name: 'Restaurant name', rating: '4.6', dist: '1.4km', price: '$' },
  { id: 6, name: 'Restaurant name', rating: '4.1', dist: '1.8km', price: '$$' },
]

export default function FavScreen() {

  return (
    <div className="maps-screen">
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
