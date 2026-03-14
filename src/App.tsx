import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

// idk if this alr cover all of it or not
interface Macros {
  protein: number, 
  fat: number, 
  calories: number, 
  budget: number,
}

function App() {
  //const [count, setCount] = useState(0)
  const [formData, setFormData] = useState<Macros>({
    protein: 0,
    fat: 0,
    calories: 0,
    budget: 0
  });
  
  // NEW: State to track if filters are visible
  const [showFilters, setShowFilters] = useState(false);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value) || 0
    });
  };

  const [apiResult, setApiResult] = useState<any[]>([]);
  const requestApi = async (e:any) => {
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

  function getYear () {
    const date:Date = new Date();
    return date.getFullYear();
  }

  // Toggle filter visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  }

  return (
    <>
    <div id='header'>
      {/* NEW: Button to toggle filters */}
      <button onClick={toggleFilters} id='toggleFilterBtn'>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>
    </div>
    
    <div id='main content'>
      {/* Conditionally render filters based on showFilters state */}
      {showFilters && (
        <div className='filter'>
          <form onSubmit={requestApi}>
            <label className='inputForm'>
              Protein: 
              <input 
                type='number' 
                name='protein'
                onChange={handleInputChange}
              />
            </label>
            
            <label className='inputForm'>
              Fat: 
              <input 
                type='number' 
                name='fat' 
                onChange={handleInputChange}
              />
            </label>
            
            <br/>
            
            <label className='inputForm'>
              Calories: 
              <input 
                type='number' 
                name='calories' 
                onChange={handleInputChange}
              />
            </label>
            
            <label className='inputForm'>
              Budget: 
              <input 
                type='number' 
                name='budget'
                onChange={handleInputChange}
              />
            </label>
            
            <br/>
            
            <button id='buttonForm' type='button'>Apply Filter</button>
          </form>
        </div>
      )}
      
      <div className='map'></div>
    </div>

    {/* you guys could remove this is we're not going to use CC license */}
    <div id='footer'>
      <p>This work is licensed under <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a><img id='cc'src="https://mirrors.creativecommons.org/presskit/icons/cc.svg" alt="CC"/><img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/by.svg" alt="BY"/><img id='cc' src="https://mirrors.creativecommons.org/presskit/icons/nc.svg" alt="NC"/></p>
    </div>
    </>
  )
}

export default App;