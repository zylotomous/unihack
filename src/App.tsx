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

  function getYear () {
    const date:Date = new Date();
    return date.getFullYear();
  }

  return (
    <>
    <div id='header'>
      <button onClick={toggleFilters} id='toggleFilterBtn'>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
    
    <div id='main content'>
      {showFilters && (
        <div className='filter'>
          <form>
            <label className='inputForm'>
              Protein: 
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
              Fat: 
              <input 
                type='number' 
                name='fat' 
                placeholder="0"
                value={inputValues.fat}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </label>
            
            <br/>
            
            <label className='inputForm'>
              Calories: 
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
              Budget: 
              <input 
                type='number' 
                name='budget' 
                placeholder="0"
                value={inputValues.budget}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
            </label>
            
            <br/>
            
            <button id='buttonForm' type='button'>Apply Filter</button>
          </form>
          
          {/* Optional: Display current numeric values for debugging */}
          <div style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>
            Current values: Protein: {formData.protein}g, Fat: {formData.fat}g, Calories: {formData.calories}, Budget: ${formData.budget}
          </div>
        </div>
      )}
      
      <div className='map'></div>
    </div>

    <div id='footer'>
      <p>This work is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a><img id='cc'src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC"/><img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY"/><img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC"/></p>
    </div>
    </>
  )
}

export default App;