import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';
import Logout from './components/Logout/Logout';
import Login from './components/Login/Login';
import Main from './components/Main/Main';
import NavBar from './components/NavBar/NavBar';
import Info from './components/Info/Info';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token !== null) {
      // se il token è scaduto lo tolgo dal localStorage e dallo stato e refresho la pagina
      const paiload = JSON.parse(atob(token.split('.')[1]));
      if (paiload.exp * 1000 < Date.now()) { // se il token è scaduto
        localStorage.removeItem('token');
        setToken(null);
        window.location.reload();
      }
    }
  }, []);

  function handleLogin(token) {
    localStorage.setItem('token', token);
    setToken(token);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setToken(null);
  }
  return (
    <>
      <NavBar />

      {token ? (
        <>
          <div className="logout-box">
            <Logout onLogout={handleLogout} />
          </div>
          <Main token={token} />
        </>
      ) : (
        <> 
          <Login onLogin={handleLogin} />
          <Info />
        </>
      )}
    </>
  )
}

export default App
