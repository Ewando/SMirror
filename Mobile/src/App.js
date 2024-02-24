import React from 'react';
import './App.css';
import Navbar from './comps/Navbar';
import Home from './pages/Dashboard'; 
import GestureControl from './pages/GestureControl';
import Modules from './pages/Modules';
import Login from './pages/Login'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/gesture-control" element={<GestureControl />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/" element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
