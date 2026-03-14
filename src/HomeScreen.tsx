import { useState } from 'react'
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

const EMPTY_FILTERS: Filters = { protein: '', fat: '', calories: '', budget: '' }

export default function HomeScreen() {
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  function applyFilters() {
    // TODO: pass filters to map / search logic
    console.log('Applied filters:', filters)
    setShowFilters(false)
  }

  return (
    <div className="app">

      {/* ── Top Bar ── */}
      <header className="top-bar">
        <div className="logo">
          <img src={logoSvg} alt="logo" width={50} height={50} />
        </div>
        <div className="profile">
          <img src={profileSvg} alt="profile" width={40} height={40} />
        </div>
      </header>

      {/* ── Search Bar ── */}
      <div className="search-bar">
        <span className="search-icon">
          <img src={magglassSvg} alt="search" width={20} height={20} />
        </span>
        <input
          type="text"
          placeholder="Search a specific restaurant here"
          className="search-input"
        />
        <button className={`filter-btn${showFilters ? ' filter-btn--active' : ''}`} onClick={() => setShowFilters(v => !v)}>
          <img src={filterSvg} alt="filter" width={24} height={24} />
        </button>
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-row">
            <label className="filter-label">
              Protein (g)
              <input type="number" name="protein" placeholder="any" value={filters.protein} onChange={handleFilterChange} className="filter-input" />
            </label>
            <label className="filter-label">
              Fat (g)
              <input type="number" name="fat" placeholder="any" value={filters.fat} onChange={handleFilterChange} className="filter-input" />
            </label>
          </div>
          <div className="filter-row">
            <label className="filter-label">
              Calories
              <input type="number" name="calories" placeholder="any" value={filters.calories} onChange={handleFilterChange} className="filter-input" />
            </label>
            <label className="filter-label">
              Budget ($)
              <input type="number" name="budget" placeholder="any" value={filters.budget} onChange={handleFilterChange} className="filter-input" />
            </label>
          </div>
          <button className="filter-apply-btn" onClick={applyFilters}>Apply Filter</button>
        </div>
      )}

      {/* ── Map Area ── */}
      <main className="map-area">
        {/* Map component goes here */}
      </main>

      {/* ── Bottom Navigation ── */}
      <nav className="bottom-nav">
        <button className="nav-item">
          <img src={exploreSvg} alt="explore" width={32} height={32} />
          <span>Explore</span>
        </button>
        <button className="nav-item">
          <img src={mapsSvg} alt="maps" width={32} height={32} />
          <span>Maps</span>
        </button>
        <button className="nav-item nav-item--active">
          <img src={bookmarkSvg} alt="saved" width={32} height={32} />
          <span>Saved</span>
        </button>
        <button className="nav-item">
          <img src={offersSvg} alt="offers" width={32} height={32} />
          <span>Offers</span>
        </button>
      </nav>

    </div>
  )
}
