// src/hooks/nurse/useNurseMeds.js
import { useState, useEffect } from 'react';
import { getMedicationSchedules } from '../../services/nurseService';

export function useNurseMeds() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMeds();
  }, []);

  async function loadMeds() {
    try {
      const data = await getMedicationSchedules();
      setMeds(data || []);
    } finally {
      setLoading(false);
    }
  }

  return { meds, loading };
}