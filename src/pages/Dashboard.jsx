import React, { useState, useEffect } from 'react';
import { getTrackedSymptoms, getSymptomStatsToday, isOnboardingComplete } from '../store/localStore';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [symptoms, setSymptoms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOnboardingComplete()) {
      navigate('/manage-symptoms');
      return;
    }
    
    const tracked = getTrackedSymptoms();
    const withStats = tracked.map(name => {
      const stats = getSymptomStatsToday(name);
      return { name, ...stats };
    });
    setSymptoms(withStats);
  }, [navigate]);

  const getBadgeStyle = (severity) => {
    if (!severity) return {};
    switch(severity) {
      case 'Svår': return { backgroundColor: 'var(--severity-severe)', color: '#fff' };
      case 'Måttlig': return { backgroundColor: 'var(--severity-moderate)', color: '#000' };
      case 'Lindrig': return { backgroundColor: 'var(--severity-mild)', color: '#000' };
      default: return { backgroundColor: '#475569', color: '#fff' };
    }
  };

  return (
    <div className="page-container">
      <h1>Följda Symtom</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Spåra dina hälsoproblem löpande.</p>
      
      {symptoms.map(symp => (
        <div key={symp.name} className="card">
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>{symp.name}</h2>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>&gt;</span>
          </div>
          
          <div className="flex-between" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '8px' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'block' }}>Idag</span>
              <span style={{ fontWeight: '600' }}>{symp.count} gånger</span>
            </div>
            {symp.latestSeverity && (
              <span style={{ 
                ...getBadgeStyle(symp.latestSeverity),
                padding: '0.25rem 0.75rem', 
                borderRadius: '4px', 
                fontSize: '0.8rem', 
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {symp.latestSeverity}
              </span>
            )}
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/log?symptom=${encodeURIComponent(symp.name)}`)}
          >
            Lägg till tillfälle
          </button>
        </div>
      ))}
      
      <button 
        className="btn" 
        style={{ marginTop: '1rem', border: '1px solid var(--card-border)' }}
        onClick={() => navigate('/manage-symptoms')}
      >
        Lägg till/ta bort symtom
      </button>
    </div>
  );
};

export default Dashboard;
