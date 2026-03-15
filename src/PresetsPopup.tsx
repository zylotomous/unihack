import { useState } from 'react'
import threebarsSvg from './assets/threebars.svg'

interface Preset {
  id: number
  name: string
  protein: string
  fat: string
  calories: string
  budget: string
}

interface NewPreset {
  name: string
  protein: string
  fat: string
  calories: string
  budget: string
}

interface PresetsPopupProps {
  onClose: () => void
  onApply?: (filters: { protein: string; fat: string; calories: string; budget: string }) => void
}

const DEFAULT_PRESETS: Preset[] = [
  { id: 1, name: 'Breakfast',      protein: '', fat: '', calories: '', budget: '' },
  { id: 2, name: 'Lunch',          protein: '', fat: '', calories: '', budget: '' },
  { id: 3, name: 'Dinner',         protein: '', fat: '', calories: '', budget: '' },
  { id: 4, name: 'Bulking filters',protein: '', fat: '', calories: '', budget: '' },
  { id: 5, name: 'Cutting filters',protein: '', fat: '', calories: '', budget: '' },
]

const EMPTY: NewPreset = { name: '', protein: '', fat: '', calories: '', budget: '' }

export default function PresetsPopup({ onClose, onApply }: PresetsPopupProps) {
  const [presets, setPresets] = useState<Preset[]>(DEFAULT_PRESETS)
  const [form, setForm] = useState<NewPreset>(EMPTY)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function selectPreset(p: Preset) {
    setSelectedId(p.id)
    setForm({ name: p.name, protein: p.protein, fat: p.fat, calories: p.calories, budget: p.budget })
  }

  function deletePreset(id: number) {
    setPresets(presets.filter(p => p.id !== id))
    if (selectedId === id) {
      setSelectedId(null)
      setForm(EMPTY)
    }
  }

  function savePreset() {
    if (!form.name.trim()) return
    if (selectedId !== null) {
      // update existing
      setPresets(presets.map(p => p.id === selectedId ? { ...p, ...form } : p))
    } else {
      setPresets([...presets, { id: Date.now(), ...form }])
    }
    setSelectedId(null)
    setForm(EMPTY)
  }

  function discardPreset() {
    setSelectedId(null)
    setForm(EMPTY)
  }

  function applyPreset() {
    onApply?.({ protein: form.protein, fat: form.fat, calories: form.calories, budget: form.budget })
    onClose()
  }

  return (
    <div className="presets-overlay" onClick={onClose}>
      <div className="presets-popup" onClick={e => e.stopPropagation()}>

        {/* ── Sidebar ── */}
        <aside className={`presets-sidebar${sidebarOpen ? '' : ' presets-sidebar--collapsed'}`}>
          {sidebarOpen && <span className="presets-sidebar-title">Presets</span>}
          <button className="presets-hamburger" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <img src={threebarsSvg} alt="menu" width={20} height={20} />
          </button>
          {sidebarOpen && (
            <ul className="presets-list">
              {presets.map(p => (
                <li
                  key={p.id}
                  className={`preset-item${selectedId === p.id ? ' preset-item--selected' : ''}`}
                  onClick={() => selectPreset(p)}
                >
                  <span className="preset-item-name">{p.name}</span>
                  <button
                    className="preset-delete-btn"
                    onClick={e => { e.stopPropagation(); deletePreset(p.id) }}
                    aria-label="Delete preset"
                  >✕</button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        {/* ── Form ── */}
        <div className="presets-content">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="preset-name-input"
          />

          <div className="preset-fields-row">
            <label className="preset-field-label">
              Protein (g)
              <input type="number" name="protein" value={form.protein} onChange={handleChange} className="preset-field-input" />
            </label>
            <label className="preset-field-label">
              Fat (g)
              <input type="number" name="fat" value={form.fat} onChange={handleChange} className="preset-field-input" />
            </label>
          </div>

          <div className="preset-fields-row">
            <label className="preset-field-label">
              Calories
              <input type="number" name="calories" value={form.calories} onChange={handleChange} className="preset-field-input" />
            </label>
            <label className="preset-field-label">
              Budget
              <input type="number" name="budget" value={form.budget} onChange={handleChange} className="preset-field-input" />
            </label>
          </div>

          <div className="preset-actions">
            <button className="preset-save-btn" onClick={savePreset}>Save as new preset</button>
            <button className="preset-discard-btn" onClick={discardPreset}>Discard the preset</button>
            <button className="preset-apply-btn" onClick={applyPreset}>Apply preset</button>
          </div>
        </div>

      </div>
    </div>
  )
}
