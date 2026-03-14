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

  function requestApi () {
    let res = setFormData;
    return res;
  }

  function getYear () {
    const date:Date = new Date();
    return date.getFullYear();
  }
  return (
    <>
    <div id='header'></div>
    <div id='main content'>
      {/* idk how to hide and fix ts tbh */}
      <div className='filter'>
        <form onSubmit={requestApi()}>
          <label className='inputForm'>Protein: <input type='number' name='protein' value={formData.protein}/></label>
          <label className='inputForm'>Fat: <input type='number' name='fat' value={formData.fat}/></label>
          <br/>
          <label className='inputForm'>Calories: <input type='number' name='calories' value={formData.calories}/></label>
          <label className='inputForm'>Budget: <input type='number' name='budget' value={formData.budget}/></label>
          <br/>
          <button id='buttonForm' type='button'>Apply Filter</button>
        </form>
      </div>
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
