import { Platform, NativeModules } from 'react-native';

// Try to infer your dev machine's IP from Metro's scriptURL
function getDevHost() {
  try {
    const url = NativeModules?.SourceCode?.scriptURL || '';
    // e.g. http://192.168.1.50:8081/index.bundle?... or exp://192.168.1.50:19000
    const m = String(url).match(/^(?:[a-z]+:\/\/)?([^\/:]+)(?::(\d+))?/i);
    if (m) {
      const host = m[1];
      const port = m[2] ? Number(m[2]) : null;
      return { host, port };
    }
  } catch {}
  return null;
}

function guessDevBaseUrl(port = 3000) {
  const envUrl = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_API_BASE_URL) ||
                 (globalThis && globalThis.EXPO_PUBLIC_API_BASE_URL);
  if (envUrl) return String(envUrl).replace(/\/$/, '');

  const info = getDevHost();
  let host = info?.host || 'localhost';
  if (host === 'localhost' || host === '127.0.0.1') {
    // Android emulator needs 10.0.2.2 to reach host
    if (Platform.OS === 'android') host = '10.0.2.2';
  }
  return `http://${host}:${port}`; // change port if your backend uses a different one
}

export const API_BASE_URL = guessDevBaseUrl(3000); // <-- set your backend port here if not 3000
export const PATIENT_ID = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_PATIENT_ID) || 'DEMO_PATIENT';

// Return a Bearer token string if your API requires it. Keep null for open endpoints.
export async function getAuthToken() {
  // Example: return await SecureStore.getItemAsync('token');
  return null;
}
export const RELATIVE_ID = (typeof process !== 'undefined' && process.env && process.env.EXPO_PUBLIC_RELATIVE_ID) || null;
