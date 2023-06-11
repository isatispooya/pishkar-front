import './style/style.css';
import {BrowserRouter, Routes, Route, useRouterHistory} from 'react-router-dom'
import { useEffect } from 'react';
import Home from './page/Home';
import Desk from './page/Desk';
import { caching } from './componet/Cash';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() =>{document.title = 'پیشکار'}, [])
  caching()
  return (
    <BrowserRouter >
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/desk' element={<Desk/>}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
