import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Assessment from './components/Assessment';
import RandomResults from './components/RandomResults';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assessment" element={<Assessment />} />
        <Route path="/random-results" element={<RandomResults />} />
      </Routes>
    </Router>
  );
}

export default App;