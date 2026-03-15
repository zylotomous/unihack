import { useState } from 'react'
import './App.css'
import PresetsPopup from './PresetsPopup'
import MapsScreen from './MapsScreen'

import logoSvg from './assets/logo.svg'
import profileSvg from './assets/pfp.svg'
import filterSvg from './assets/filters.svg'
import magglassSvg from './assets/magglass.svg'
import exploreSvg from './assets/explore.svg'
import mapsSvg from './assets/maps.svg'
import bookmarkSvg from './assets/favs.svg'
import offersSvg from './assets/offers.svg'
import FavScreen from './Favs'

export interface Filters {
  protein: string
  fat: string
  calories: string
  budget: string
}

const EMPTY_FILTERS: Filters = { protein: '', fat: '', calories: '', budget: '' }

type Screen = 'home' | 'maps' | 'favs'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [showPresets, setShowPresets] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState<Filters>(EMPTY_FILTERS)

  const hasFilters = Object.values(appliedFilters).some(v => v !== '')

  return (
    <div className="app">

      {/* -- Home Screen -- */}
      {screen === 'home' && (
        <>
          <header className="top-bar">
            <div className="logo">
              <img src={logoSvg} alt="logo" width={50} height={50} />
            </div>
            <div className="profile">
              <img src={profileSvg} alt="profile" width={40} height={40} />
            </div>
          </header>

          <div className="search-bar">
            <span className="search-icon">
              <img src={magglassSvg} alt="search" width={20} height={20} />
            </span>
            <input
              type="text"
              placeholder="Search a specific restaurant here"
              className="search-input"
            />
            <button
              className={`filter-btn${hasFilters ? ' filter-btn--active' : ''}`}
              onClick={() => setShowPresets(true)}
            >
              <img src={filterSvg} alt="filter" width={24} height={24} />
            </button>
          </div>

          {hasFilters && (
            <div className="filter-chips">
              {appliedFilters.protein && <span className="filter-chip">Protein: {appliedFilters.protein}g</span>}
              {appliedFilters.fat && <span className="filter-chip">Fat: {appliedFilters.fat}g</span>}
              {appliedFilters.calories && <span className="filter-chip">Cal: {appliedFilters.calories}</span>}
              {appliedFilters.budget && <span className="filter-chip">Budget: ${appliedFilters.budget}</span>}
              <button className="filter-chip filter-chip--clear" onClick={() => setAppliedFilters(EMPTY_FILTERS)}>? Clear</button>
            </div>
          )}

          <main className="map-area">
            {/* Map component goes here */}
          </main>
        </>
      )}

      {/* -- Maps Screen -- */}
      {screen === 'maps' && (
        <MapsScreen
          filters={appliedFilters}
          onOpenPresets={() => setShowPresets(true)}
          onClearFilters={() => setAppliedFilters(EMPTY_FILTERS)}
        />
      )}

      {screen === 'favs' && (
        <FavScreen/>
      )}

      {/* -- Bottom Navigation -- */}
      <nav className="bottom-nav">
        <button
          className={`nav-item${screen === 'home' ? ' nav-item--active' : ''}`}
          onClick={() => setScreen('home')}
        >
          <img src={exploreSvg} alt="explore" width={32} height={32} />
          <span>Explore</span>
        </button>
        <button
          className={`nav-item${screen === 'maps' ? ' nav-item--active' : ''}`}
          onClick={() => setScreen('maps')}
        >
          <img src={mapsSvg} alt="maps" width={32} height={32} />
          <span>Maps</span>
        </button>
        <button className="nav-item nav-item--presets" onClick={() => setShowPresets(true)}>
          <div className="nav-presets-icon">+</div>
          <span>Presets</span>
        </button>
        <button className="nav-item">
          <img src={bookmarkSvg} alt="favs" width={32} height={32} />
          <span>Favs</span>
        </button>
        <button className="nav-item">
          <img src={offersSvg} alt="offers" width={32} height={32} />
          <span>Offers</span>
        </button>
      </nav>

      {/* -- Presets Popup -- */}
      {showPresets && (
        <PresetsPopup
          onClose={() => setShowPresets(false)}
          onApply={f => setAppliedFilters(f)}
        />
      )}

    </div>
  )
}

