import React, { useState, useEffect } from 'react';
import { saveSymptomLog, addTrackedSymptom, getSymptomLogs } from '../store/localStore';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SymptomLog = () => {
  const [searchParams] = useSearchParams();
  const initialSymptom = searchParams.get('symptom') || '';
  
  const [symptom, setSymptom] = useState(initialSymptom);
  const [severity, setSeverity] = useState('Måttlig');
  const [notes, setNotes] = useState('');
  const [pastLogs, setPastLogs] = useState([]);
  const navigate = useNavigate();

  // Load past logs for the currently selected symptom
  useEffect(() => {
    if (symptom.trim()) {
      const allLogs = getSymptomLogs();
      const filtered = allLogs
        .filter(log => log.symptom.toLowerCase() === symptom.trim().toLowerCase())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setPastLogs(filtered);
    } else {
      setPastLogs([]);
    }
  }, [symptom]);

  const handleSave = () => {
    if (!symptom.trim()) return;
    addTrackedSymptom(symptom.trim());
    saveSymptomLog({ symptom: symptom.trim(), severity, notes });
    navigate('/');
  };

  const severityOptions = [
    { label: 'Lindrig', value: 'Lindrig', color: 'var(--severity-mild)' },
    { label: 'Måttlig', value: 'Måttlig', color: 'var(--severity-moderate)' },
    { label: 'Svår', value: 'Svår', color: 'var(--severity-severe)' },
  ];

  const getBadgeStyle = (sev) => {
    switch(sev) {
      case 'Svår': return { backgroundColor: 'var(--severity-severe)', color: '#fff' };
      case 'Måttlig': return { backgroundColor: 'var(--severity-moderate)', color: '#000' };
      case 'Lindrig': return { backgroundColor: 'var(--severity-mild)', color: '#000' };
      default: return { backgroundColor: '#475569', color: '#fff' };
    }
  };

  // Format date helper (e.g. "Idag kl 14:30" or "24 okt kl 14:30")
  const formatTime = (isoString, dateString) => {
    const d = new Date(isoString);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if it's today
    const today = new Date().toISOString().split('T')[0];
    if (dateString === today) {
      return `Idag kl ${time}`;
    }
    
    // Otherwise return short date and time
    return `${d.toLocaleDateString('sv-SE', { day: 'numeric', month: 'short' })} kl ${time}`;
  };

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} style={{ color: 'var(--text-secondary)', fontSize: '1rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          &lt; Tillbaka
        </button>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Lägg till tillfälle</h1>
        <div style={{ width: '60px' }}></div>
      </div>

      <div className="card">
        <label>
          <h3 style={{ marginBottom: '0.5rem' }}>Symtom</h3>
          <input 
            type="text" 
            value={symptom} 
            onChange={(e) => setSymptom(e.target.value)}
            placeholder="T.ex. Huvudvärk"
          />
        </label>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '1rem' }}>Allvarlighetsgrad</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {severityOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSeverity(opt.value)}
              style={{
                flex: 1,
                padding: '1rem 0.5rem',
                borderRadius: '8px',
                border: severity === opt.value ? `2px solid ${opt.color}` : '1px solid var(--card-border)',
                backgroundColor: severity === opt.value ? `${opt.color}20` : 'var(--bg-color)',
                color: severity === opt.value ? opt.color : 'var(--text-primary)',
                fontWeight: severity === opt.value ? 'bold' : 'normal',
                cursor: 'pointer'
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <label>
          <h3 style={{ marginBottom: '0.5rem' }}>Anteckningar (frivilligt)</h3>
          <textarea 
            rows="3" 
            placeholder="Något särskilt att notera?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          ></textarea>
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleSave} style={{ marginTop: '1rem', marginBottom: '2rem' }} disabled={!symptom.trim()}>
        Spara Logg
      </button>

      {/* HISTORIK / ÖVERSIKT LÄNGST NER */}
      {symptom.trim() && pastLogs.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
            Tidigare loggar för {symptom}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pastLogs.map(log => (
              <div key={log.id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    {formatTime(log.timestamp, log.date)}
                  </span>
                  {log.severity && (
                    <span style={{ 
                      ...getBadgeStyle(log.severity),
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      fontWeight: 'bold',
                      textTransform: 'uppercase'
                    }}>
                      {log.severity}
                    </span>
                  )}
                </div>
                {log.notes ? (
                  <p style={{ fontSize: '0.9rem', margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "{log.notes}"
                  </p>
                ) : (
                  <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)', opacity: 0.5 }}>
                    Inga anteckningar.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SymptomLog;
