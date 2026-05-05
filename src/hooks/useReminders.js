import { useEffect, useRef } from 'react';
import { getMedications, getMedicationsTakenToday } from '../store/localStore';

export const useReminders = () => {
  const notifiedMeds = useRef(new Set());

  useEffect(() => {
    // Fråga om notis-behörighet
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      if (!("Notification" in window) || Notification.permission !== "granted") return;

      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeString = `${currentHours}:${currentMinutes}`;

      const meds = getMedications();
      const takenToday = getMedicationsTakenToday();

      meds.forEach(med => {
        if (med.reminderTime && med.reminderTime === currentTimeString && !takenToday.includes(med.id)) {
          const medKey = `${med.id}-${currentTimeString}`;
          if (!notifiedMeds.current.has(medKey)) {
            new Notification('Dags för medicin!', {
              body: `Det är tid att ta din medicin: ${med.name} (${med.dosage})`,
              icon: '/favicon.svg' // PWA icon
            });
            notifiedMeds.current.add(medKey);
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30s
    checkReminders();

    return () => clearInterval(interval);
  }, []);
};
