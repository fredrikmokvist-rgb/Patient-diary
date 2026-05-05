import { format } from 'date-fns';

// Helper to get today's date string YYYY-MM-DD
export const getToday = () => format(new Date(), 'yyyy-MM-dd');

// Symptoms Store
export const saveSymptomLog = (logData) => {
  const existing = getSymptomLogs();
  const entry = { id: Date.now(), date: getToday(), timestamp: new Date().toISOString(), ...logData };
  existing.push(entry);
  localStorage.setItem('symptoms', JSON.stringify(existing));
  return entry;
};

export const getSymptomLogs = () => {
  const data = localStorage.getItem('symptoms');
  return data ? JSON.parse(data) : [];
};

// Tracked Symptoms & Onboarding
export const isOnboardingComplete = () => {
  return localStorage.getItem('onboarding_complete') === 'true';
};

export const completeOnboarding = () => {
  localStorage.setItem('onboarding_complete', 'true');
};

export const getTrackedSymptoms = () => {
  const data = localStorage.getItem('tracked_symptoms');
  return data ? JSON.parse(data) : [];
};

export const saveTrackedSymptoms = (symptomsArray) => {
  localStorage.setItem('tracked_symptoms', JSON.stringify(symptomsArray));
};

export const addTrackedSymptom = (symptomName) => {
  const existing = getTrackedSymptoms();
  if (!existing.includes(symptomName)) {
    existing.push(symptomName);
    saveTrackedSymptoms(existing);
  }
};

export const getSymptomStatsToday = (symptomName) => {
  const logs = getSymptomLogs();
  const today = getToday();
  const todaysLogs = logs.filter(l => l.date === today && l.symptom === symptomName);
  
  const count = todaysLogs.length;
  let latestSeverity = null;
  
  if (count > 0) {
    const latestLog = todaysLogs[todaysLogs.length - 1];
    if (latestLog.severity) {
      latestSeverity = latestLog.severity;
    } else {
      // Fallback for older logs with intensity 1-10
      if (latestLog.intensity > 7) latestSeverity = 'Svår';
      else if (latestLog.intensity > 4) latestSeverity = 'Måttlig';
      else latestSeverity = 'Lindrig';
    }
  }
  return { count, latestSeverity };
};

// Medications Store
export const getMedications = () => {
  const data = localStorage.getItem('medications');
  // Default sample medications if empty
  if (!data) {
    const defaultMeds = [
      { id: 1, name: 'Paracetamol', dosage: '500mg', frequency: 'Vid behov' },
      { id: 2, name: 'Omeprazol', dosage: '20mg', frequency: 'Morgon' }
    ];
    localStorage.setItem('medications', JSON.stringify(defaultMeds));
    return defaultMeds;
  }
  return JSON.parse(data);
};

export const saveMedication = (med) => {
  const existing = getMedications();
  existing.push({ id: Date.now(), ...med });
  localStorage.setItem('medications', JSON.stringify(existing));
};

export const updateMedicationReminder = (id, time) => {
  const existing = getMedications();
  const updated = existing.map(med => med.id === id ? { ...med, reminderTime: time } : med);
  localStorage.setItem('medications', JSON.stringify(updated));
};

// Medication Tracking (Daily check-offs)
export const logMedicationTaken = (medId) => {
  const today = getToday();
  const data = localStorage.getItem('medication_logs');
  const logs = data ? JSON.parse(data) : {};
  
  if (!logs[today]) logs[today] = [];
  if (!logs[today].includes(medId)) {
    logs[today].push(medId);
    localStorage.setItem('medication_logs', JSON.stringify(logs));
  }
};

export const getMedicationsTakenToday = () => {
  const today = getToday();
  const data = localStorage.getItem('medication_logs');
  const logs = data ? JSON.parse(data) : {};
  return logs[today] || [];
};
