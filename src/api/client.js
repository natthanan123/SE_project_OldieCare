import { API_BASE_URL } from '../config';

let TOKEN = null;
let CURRENT_PATIENT_ID = null;

async function fetchJson(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    console.log("API ERROR:", path, data);
    throw new Error(data?.message || `HTTP ${res.status}`);
  }

  return data;
}

/* ================= LOGIN ================= */
export async function login(email) {
  const data = await fetchJson('/auth/login-simple', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  if (data?.success) {
    TOKEN = data.token;
    CURRENT_PATIENT_ID = data.elderlyId || null;

    console.log("LOGIN SUCCESS");
    console.log("TOKEN:", TOKEN);
    console.log("PATIENT ID:", CURRENT_PATIENT_ID);
  }

  return data;
}

/* ================= HOME SUMMARY ================= */
export async function getHomeSummary() {
  if (!CURRENT_PATIENT_ID) {
    console.log("No CURRENT_PATIENT_ID");
    return {
      calories: 0,
      temp: 0,
      meds: []
    };
  }

  return await fetchJson(`/patients/${CURRENT_PATIENT_ID}/summary`);
}

/* ================= ACTIVITIES ================= */
export async function getActivities() {
  const arr = await fetchJson('/activities');
  return Array.isArray(arr) ? arr : [];
}

/* ================= NOTIFICATIONS ================= */
export async function getNotifications() {
  const arr = await fetchJson('/notifications');
  return Array.isArray(arr) ? arr : [];
}

/* ================= REPORTS ================= */
export async function getReports() {
  const arr = await fetchJson('/reports');
  return Array.isArray(arr) ? arr : [];
}

/* ================= CHAT ================= */
export async function getMessages(threadId) {
  return await fetchJson(`/threads/${threadId}/messages`);
}

export async function sendMessage(threadId, text) {
  return await fetchJson(`/threads/${threadId}/messages`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export async function getThreads() {
  return await fetchJson('/threads');
}

/* ================= LOGOUT ================= */
export function logout() {
  TOKEN = null;
  CURRENT_PATIENT_ID = null;
}
