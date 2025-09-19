// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import BotsPage from './pages/BotsPage';
import CallLogsPage from './pages/CallLogsPage';
import './index.css'; 
import CallLogDetailPage from './pages/CallLogDetailPage';

function App() {
  return (
    <Router>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<BotsPage />} />
          <Route path="/call-logs" element={<CallLogsPage />} />
          <Route path="/call-logs/:id" element={<CallLogDetailPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;