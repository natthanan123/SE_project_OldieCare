// src/services/sosService.js
import { USE_MOCK } from '../utils/config';

export async function getActiveSOS() {
  if (USE_MOCK) {
    return {
      elderName: 'Mrs. Smith',
      room: '204',
    };
  }

  // future API
  // const res = await api.get('/sos/active');
  // return res.data || null;
}