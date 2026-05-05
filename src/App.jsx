import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SymptomLog from './pages/SymptomLog';
import Medications from './pages/Medications';
import History from './pages/History';
import ManageSymptoms from './pages/ManageSymptoms';
import Navbar from './components/Navbar';
import { useReminders } from './hooks/useReminders';
import './index.css';

function App() {
  useReminders();

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/log" element={<SymptomLog />} />
          <Route path="/meds" element={<Medications />} />
          <Route path="/history" element={<History />} />
          <Route path="/manage-symptoms" element={<ManageSymptoms />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;
