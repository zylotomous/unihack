import { useState } from 'react'
import './App.css'

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Update the display value (can be empty string or any number)
    setInputValues({
      ...inputValues,
      [name]: value
    });
    
    // Only update the numeric formData if there's a valid number
    // This prevents updating while user is deleting
    if (value === '') {
      // Don't update formData yet - wait until they finish typing
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

  // When input loses focus, ensure empty fields become 0
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (value === '') {
      // Reset to 0 in both states
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
          
          {/* Optional: Display current numeric values for debugging */}
          <div className="debug-info">
            Current: P:{formData.protein}g | F:{formData.fat}g | C:{formData.calories} | ${formData.budget}
          </div>
        </div>
      )}
      
      <div className='map'></div>
    </div>

    <div id='footer'>
      <p>This work is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a><img id='cc'src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC"/><img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY"/><img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC"/></p>
    </div>
    
    </div>
  )

  
}


export default App;