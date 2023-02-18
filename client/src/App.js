import React from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import OnBoarding from './pages/OnBoarding';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies();

  const AuthToken = cookies.AuthToken;

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>} />
        {AuthToken && <Route path='/dashboard' element={<Dashboard/>} />}
        <Route path='/onboarding' element={<OnBoarding/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;