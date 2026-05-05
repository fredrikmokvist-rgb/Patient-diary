import React, { useState, useEffect } from 'react';
import { getTrackedSymptoms, saveTrackedSymptoms, completeOnboarding } from '../store/localStore';
import { useNavigate } from 'react-router-dom';

const ALL_SYMPTOMS = [
  "Minskad sexlust (Libido)",
  "Erektionsproblem (Erektil dysfunktion)",
  "Trötthet / Brist på energi",
  "Nedstämdhet / Depression",
  "Minskad muskelmassa och styrka",
  "Ökad mängd kroppsfett (särskilt runt magen)",
  "Värmevallningar och svettningar",
  "Sömnproblem",
  "Koncentrationssvårigheter / Hjälndimma",
  "Minskad kroppsbehåring / Skäggväxt",
  "Förstorade bröst (Gynekomasti)",
  "Irritabilitet / Humörsvängningar",
  "Minskad motivation och självförtroende",
  "Håglöshet / Apati",
  "Benskörhet (Osteoporos) / Ledvärk"
];

const ManageSymptoms = () => {
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const tracked = getTrackedSymptoms();
    setSelected(tracked);
  }, []);

  const toggleSymptom = (symp) => {
    if (selected.includes(symp)) {
      setSelected(selected.filter(s => s !== symp));
    } else {
      setSelected([...selected, symp]);
    }
  };

  const handleSave = () => {
    saveTrackedSymptoms(selected);
    completeOnboarding();
    navigate('/');
  };

  return (
    <div className="page-container" style={{ paddingBottom: '9rem' }}>
      <h1>Välj Symtom</h1>
      <p style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Vilka symtom vill du spåra? Du kan alltid ändra detta senare.
      </p>

      <div className="card" style={{ padding: '0.5rem 1.25rem' }}>
        {ALL_SYMPTOMS.map((symp, idx) => (
          <label 
            key={idx} 
            className="flex-between"
            style={{ 
              padding: '1rem 0',
              borderBottom: idx < ALL_SYMPTOMS.length - 1 ? '1px solid var(--card-border)' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '1rem', flex: 1 }}>{symp}</span>
            <input 
              type="checkbox" 
              checked={selected.includes(symp)}
              onChange={() => toggleSymptom(symp)}
              style={{ width: '24px', height: '24px', margin: 0, accentColor: 'var(--btn-primary)' }}
            />
          </label>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1.5rem 1rem', background: 'var(--bg-color)', borderTop: '1px solid var(--card-border)', zIndex: 100 }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleSave}
            disabled={selected.length === 0}
            style={{ opacity: selected.length === 0 ? 0.5 : 1 }}
          >
            Spara ({selected.length} valda)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSymptoms;
