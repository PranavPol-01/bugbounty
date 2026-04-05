const API_BASE = "/api";

async function request(url, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("db_token") : null;
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// ── Users ─────────────────────────────────────────────────────────────
export const authUser = (body) => request("/users/auth", { method: "POST", body: JSON.stringify(body) });
export const getUserProfile = (address) => request(`/users/${address}`);
export const updateProfile = (body) => request("/users/profile", { method: "PUT", body: JSON.stringify(body) });
export const getLeaderboard = () => request("/users/leaderboard");

// ── Vaults ────────────────────────────────────────────────────────────
export const getVaults = (params = "") => request(`/vaults${params ? `?${params}` : ""}`);
export const getVault = (id) => request(`/vaults/${id}`);
export const createVaultRecord = (body) => request("/vaults", { method: "POST", body: JSON.stringify(body) });

// ── Reports ───────────────────────────────────────────────────────────
export const getReports = (params = "") => request(`/reports${params ? `?${params}` : ""}`);
export const getReport = (id) => request(`/reports/${id}`);
export const createReportRecord = (body) => request("/reports", { method: "POST", body: JSON.stringify(body) });
export const updateReportStatus = (id, body) => request(`/reports/${id}/status`, { method: "PUT", body: JSON.stringify(body) });

// ── Notifications ─────────────────────────────────────────────────────
export const getNotifications = () => request("/notifications");
export const markNotificationsRead = () => request("/notifications/mark-read", { method: "POST" });

// ── Uploads ───────────────────────────────────────────────────────────
export async function uploadImage(file) {
  const token = typeof window !== "undefined" ? localStorage.getItem("db_token") : null;
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE}/upload/image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data;
}

export async function uploadToIPFS(file, name) {
  const token = typeof window !== "undefined" ? localStorage.getItem("db_token") : null;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", name || "bug-report");
  const res = await fetch(`${API_BASE}/upload/ipfs`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "IPFS upload failed");
  return data;
}
