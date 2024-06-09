import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import PageNotFound from './components/PageNotFound';
import properties from './properties.json';

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [cookie] = useCookies(['user'])
  const menus = properties.menus

  useEffect(() => {
    if (cookie.user !== undefined)
      setIsAuth(true)
  }, [cookie.user])

  return (
    <div className="App">
      <div id='main-content'>
        <BrowserRouter>
          <Routes>
            <Route path='*' element={<PageNotFound />} />
            <Route path='/login' element={<Login />} />

            {menus.map((val, ind, arr) =>
              (isAuth && <Route key={val} path={'/' + val.toLowerCase()} Component={require('./components/' + val).default} />)
              || (!isAuth && <Route key={val} path={'/' + val.toLowerCase()} element={<Login />} />)
            )}

          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
export default App;
