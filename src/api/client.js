import { API_BASE_URL, PATIENT_ID, getAuthToken } from "../config";
import { RELATIVE_ID } from "../config";

async function fetchJson(path, options = {}) {
  const token = await getAuthToken();
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

export async function getThreads() {
  const q = RELATIVE_ID ? `?relativeId=${encodeURIComponent(RELATIVE_ID)}` : "";
  const data = await fetchJson(`/threads${q}`);
  const list = Array.isArray(data?.threads) ? data.threads : Array.isArray(data) ? data : [];
  return list.map((t) => ({
    id: t.id ?? t.threadId,
    name:
      t.name ??
      (Array.isArray(t.participants)
        ? (t.participants.find((p) => p.role !== "relative")?.name ?? "Unknown")
        : "Unknown"),
    role:
      t.role ??
      (Array.isArray(t.participants)
        ? (t.participants.find((p) => p.role !== "relative")?.role ?? "Nurse")
        : "Nurse"),
    lastMsg: t.lastMessage?.text ?? t.lastMsg ?? "",
    time: t.lastMessage?.time ?? t.time ?? "",
  }));
}

export async function getMessages(threadId) {
  const data = await fetchJson(`/threads/${threadId}/messages`);
  const list = Array.isArray(data?.messages) ? data.messages : Array.isArray(data) ? data : [];
  return list.map((m) => ({
    id: m.id ?? m.messageId,
    text: m.text ?? m.body ?? "",
    sender: m.sender === "relative" || m.sender === "me" || m.isMine ? "me" : "other",
    createdAt: m.createdAt ?? m.time ?? null,
  }));
}

export async function sendMessage(threadId, text) {
  const body = JSON.stringify({ text });
  const data = await fetchJson(`/threads/${threadId}/messages`, { method: "POST", body });
  // normalize a single returned message if present
  const m = Array.isArray(data) ? data[0] : data?.message ?? data;
  return m
    ? {
        id: m.id ?? m.messageId ?? String(Date.now()),
        text: m.text ?? text,
        sender: "me",
        createdAt: m.createdAt ?? new Date().toISOString(),
      }
    : { id: String(Date.now()), text, sender: "me", createdAt: new Date().toISOString() };
}

export async function getHomeSummary(patientId = PATIENT_ID) {
  const data = await fetchJson(`/patients/${patientId}/summary`);
  return {
    calories: data?.calories ?? 0,
    temp: data?.temp ?? data?.temperature ?? 0,
    tdee: data?.tdee ?? data?.calorieTarget ?? 0,
    pressure: data?.pressure ?? data?.bp ?? 0,
    calTargetMin: data?.calTargetMin ?? 1400,
    calTargetMax: data?.calTargetMax ?? 1600,
    updatedAt: data?.updatedAt ?? null,
    meds: Array.isArray(data?.meds)
      ? data.meds.map((x) => ({
          id: x.id ?? String(Math.random()),
          name: x.name ?? "",
          time: x.time ?? "",
          status: x.status ?? (x.taken ? "taken" : "pending"),
        }))
      : [],
  };
}

export async function getReports(patientId = PATIENT_ID) {
  const data = await fetchJson(`/patients/${patientId}/reports`);
  const list = Array.isArray(data?.reports) ? data.reports : Array.isArray(data) ? data : [];
  return list.map((r) => ({
    id: r.id ?? String(Math.random()),
    title: r.title ?? r.type ?? "Report",
    nurse: r.nurse ?? r.by ?? "",
    time: r.time ?? r.createdAt ?? "",
    status: r.status ?? "Completed",
  }));
}

export async function getNotifications(patientId = PATIENT_ID) {
  const data = await fetchJson(`/patients/${patientId}/notifications`);
  const list = Array.isArray(data?.notifications) ? data.notifications : Array.isArray(data) ? data : [];
  return list.map((n) => ({
    id: n.id ?? String(Math.random()),
    msg: n.msg ?? n.message ?? "",
    time: n.time ?? n.createdAt ?? "",
    type: n.type ?? "info",
  }));
}
