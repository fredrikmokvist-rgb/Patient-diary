import React, { useState, useEffect } from 'react';
import { getMedications, getMedicationsTakenToday, logMedicationTaken, updateMedicationReminder, saveMedication } from '../store/localStore';
import { CheckCircle, Circle, Bell, Plus, X } from 'lucide-react';

const Medications = () => {
  const [meds, setMeds] = useState([]);
  const [takenIds, setTakenIds] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: '', reminderTime: '' });

  useEffect(() => {
    setMeds(getMedications());
    setTakenIds(getMedicationsTakenToday());
    
    // Request notification permission if not granted
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleTakeMed = (id) => {
    if (!takenIds.includes(id)) {
      logMedicationTaken(id);
      setTakenIds([...takenIds, id]);
    }
  };

  const handleTimeChange = (id, time) => {
    updateMedicationReminder(id, time);
    setMeds(getMedications());
  };

  const handleSaveMed = () => {
    if (newMed.name && newMed.dosage) {
      saveMedication(newMed);
      setMeds(getMedications());
      setIsAdding(false);
      setNewMed({ name: '', dosage: '', frequency: '', reminderTime: '' });
    }
  };

  return (
    <div className="page-container">
      <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Mina Mediciner</h1>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          style={{ color: 'var(--btn-primary)', padding: '0.5rem', minHeight: '44px', minWidth: '44px' }}
          aria-label={isAdding ? 'Avbryt lägg till medicin' : 'Lägg till medicin'}
        >
          {isAdding ? <X size={28} /> : <Plus size={28} />}
        </button>
      </div>

      <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        Kryssa i dina mediciner när du tagit dem, och ställ in en tid för notiser.
      </p>

      {isAdding && (
        <div className="card" style={{ border: '1px solid var(--btn-primary)' }}>
          <h3 style={{ marginBottom: '1rem' }}>Lägg till medicin</h3>
          <input 
            type="text" 
            placeholder="Läkemedlets namn (t.ex. Alvedon)" 
            value={newMed.name}
            onChange={e => setNewMed({...newMed, name: e.target.value})}
            style={{ marginBottom: '0.5rem' }}
          />
          <input 
            type="text" 
            placeholder="Dos (t.ex. 500mg)" 
            value={newMed.dosage}
            onChange={e => setNewMed({...newMed, dosage: e.target.value})}
            style={{ marginBottom: '0.5rem' }}
          />
          <div className="flex-between" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Frekvens (valfritt)</label>
              <input 
                type="text" 
                placeholder="T.ex. Vid behov" 
                value={newMed.frequency}
                onChange={e => setNewMed({...newMed, frequency: e.target.value})}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Påminnelse (valfritt)</label>
              <input 
                type="time" 
                value={newMed.reminderTime}
                onChange={e => setNewMed({...newMed, reminderTime: e.target.value})}
              />
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleSaveMed} disabled={!newMed.name || !newMed.dosage}>
            Spara Medicin
          </button>
        </div>
      )}
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {meds.map(med => {
          const isTaken = takenIds.includes(med.id);
          return (
            <div 
              key={med.id} 
              className={`card med-card flex-between ${isTaken ? 'taken' : ''}`.trim()}
            >
              <div>
                <h3 style={{ 
                  textDecoration: isTaken ? 'line-through' : 'none',
                  color: isTaken ? 'var(--text-secondary)' : 'var(--text-primary)'
                }}>
                  {med.name}
                </h3>
                <p style={{ marginBottom: 0, marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  {med.dosage} {med.frequency ? `• ${med.frequency}` : ''}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                  <Bell size={16} color={med.reminderTime ? "var(--btn-primary)" : "var(--text-secondary)"} />
                  <input 
                    type="time" 
                    value={med.reminderTime || ''} 
                    onChange={(e) => handleTimeChange(med.id, e.target.value)}
                    style={{ 
                      padding: '0.25rem 0.5rem', 
                      margin: 0, 
                      width: 'auto', 
                      fontSize: '0.8rem', 
                      backgroundColor: 'transparent', 
                      border: '1px solid var(--card-border)',
                      color: med.reminderTime ? 'var(--btn-primary)' : 'var(--text-secondary)'
                    }}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleTakeMed(med.id)}
                disabled={isTaken}
                style={{ 
                  color: isTaken ? 'var(--success-color)' : 'var(--text-secondary)',
                  padding: '0.5rem',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                aria-label={isTaken ? `${med.name} är tagen` : `Markera ${med.name} som tagen`}
              >
                {isTaken ? <CheckCircle size={32} /> : <Circle size={32} />}
              </button>
            </div>
          );
        })}
        {meds.length === 0 && !isAdding && (
          <p style={{ textAlign: 'center', marginTop: '2rem' }}>Du har inga mediciner tillagda.</p>
        )}
      </div>
    </div>
  );
};

export default Medications;
