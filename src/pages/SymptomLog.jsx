import React, { useState, useEffect } from 'react';
import { saveSymptomLog, addTrackedSymptom, getSymptomLogs } from '../store/localStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SeverityBadge from '../components/SeverityBadge';
import formatTime from '../utils/formatTime';

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

  return (
    <div className="page-container">
      <div className="page-header">
        <button onClick={() => navigate('/')} className="back-button" aria-label="Tillbaka till översikten">
          <ChevronLeft size={20} /> Tillbaka
        </button>
        <h1>Lägg till tillfälle</h1>
        <div style={{ width: '90px' }}></div>
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
        <div className="segmented">
          {severityOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSeverity(opt.value)}
              className={`segmented-item ${severity === opt.value ? `active-severity-${opt.value.toLowerCase().replace(/[^a-z]/g, '')}` : ''}`.trim()}
              style={severity === opt.value ? { color: opt.value === 'Svår' ? '#fff' : '#000' } : undefined}
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
              <div key={log.id} className="card log-card">
                <div className="flex-between" style={{ marginBottom: '0.5rem' }}>
                  <span className="timestamp">
                    {formatTime(log.timestamp, log.date)}
                  </span>
                  <SeverityBadge severity={log.severity} />
                </div>
                {log.notes ? (
                  <p className="notes">
                    "{log.notes}"
                  </p>
                ) : (
                  <p className="no-notes">
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
