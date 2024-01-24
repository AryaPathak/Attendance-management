import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Stopwatch from './Stopwatch';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
      </Routes>
    </Router>
  );
};

export default App;
