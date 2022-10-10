import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { useState } from 'react';
import './App.css';
import Home from './Home';
import Detail from './Detail';

function App() {
  const [journey, setJourney] = useState({
    origin: '',
    destination: ''
  })

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home setJourney={setJourney}/>} />
        <Route path='/details' element={<Detail originId={journey.origin} destinationId={journey.destination}/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
