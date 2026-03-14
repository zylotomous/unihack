import { useState, useRef, useEffect } from 'react'
import './App.css'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

interface Macros {
  protein: number, 
  fat: number, 
  calories: number, 
  budget: number,
}

interface InputState {
  protein: string;
  fat: string;
  calories: string;
  budget: string;
}

function App() {
  // Keep the numeric values for the actual data
  const [formData, setFormData] = useState<Macros>({
    protein: 0,
    fat: 0,
    calories: 0,
    budget: 0
  });
  
  // Separate state for input display values (as strings)
  const [inputValues, setInputValues] = useState<InputState>({
    protein: '0',
    fat: '0',
    calories: '0',
    budget: '0'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setInputValues({
      ...inputValues,
      [name]: value
    });
    
    if (value === '') {
      return;
    }
    
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setFormData({
        ...formData,
        [name]: numValue
      });
    }
  };

  const [apiResult, setApiResult] = useState<any[]>([]);
  const requestApi = async (e: any) => {
    toggleFilters();
    e.preventDefault();
    try {
        const res = await fetch(`api`, {
        method: 'GET', 
        headers: {
          'Content/type' : "application/json"
        }, 
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      setApiResult(data); 
    } catch (e) {
      
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (value === '') {
      setInputValues({
        ...inputValues,
        [name]: '0'
      });
      setFormData({
        ...formData,
        [name]: 0
      });
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '100%'
  };

  const center = {
    lat: 40.7128,
    lng: -74.006
  };

  // Handle map load error
  const handleMapError = () => {
    setMapError('Failed to load Google Maps. Please check your API key and billing settings.');
  };

  return (
    <div id="root">
      <div id='header'>
        <button onClick={toggleFilters} id='toggleFilterBtn'>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      
      <div id='main-content'>
        {showFilters && (
          <div className='filter'>
            <form onSubmit={requestApi}>
              {/* First row - Protein and Fat */}
              <div className="input-row">
                <label className='inputForm'>
                  Protein (g)
                  <input 
                    type='number' 
                    name='protein' 
                    placeholder="0"
                    value={inputValues.protein}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </label>
                
                <label className='inputForm'>
                  Fat (g)
                  <input 
                    type='number' 
                    name='fat' 
                    placeholder="0"
                    value={inputValues.fat}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </label>
              </div>
              
              {/* Second row - Calories and Budget */}
              <div className="input-row">
                <label className='inputForm'>
                  Calories
                  <input 
                    type='number' 
                    name='calories' 
                    placeholder="0"
                    value={inputValues.calories}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </label>
                
                <label className='inputForm'>
                  Budget ($)
                  <input 
                    type='number' 
                    name='budget' 
                    placeholder="0"
                    value={inputValues.budget}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                  />
                </label>
              </div>
              
              {/* Button row */}
              <div className="button-row">
                <button id='buttonForm' type='submit'>Apply Filter</button>
              </div>
            </form>
            
            <div className="debug-info">
              Current: P:{formData.protein}g | F:{formData.fat}g | C:{formData.calories} | ${formData.budget}
            </div>
          </div>
        )}
        
        {/* Map section with error handling */}
        <div className="map-container">
          {mapError ? (
            <div className="map-error">
              <p>{mapError}</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Make sure you have:
                <br />1. Enabled Maps JavaScript API in Google Cloud Console
                <br />2. Enabled billing on your project
                <br />3. Disabled ad blockers for this site
              </p>
            </div>
          ) : (
            <LoadScript 
              googleMapsApiKey="AIzaSyC_HC3BvOfgEtUXaWtT0mol5Pyts5R9U2s" // Replace with your actual API key
              onLoad={() => {
                console.log('Maps loaded successfully');
                setIsMapLoaded(true);
              }}
              onError={handleMapError}
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                onLoad={(map) => {
                  mapRef.current = map;
                }}
                options={{
                  mapTypeControl: false,
                  streetViewControl: false,
                  fullscreenControl: true,
                }}
              >
                {/* Use standard Marker for now - warning is harmless */}
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          )}
        </div>
      </div>

      <div id='footer'>
        <p>
          This work is licensed under 
          <a href="https://creativecommons.org/licenses/by-nc/4.0/"> CC BY-NC 4.0</a>
          <img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC"/>
          <img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY"/>
          <img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC"/>
        </p>
      </div>
    </div>
  )
}

export default App;