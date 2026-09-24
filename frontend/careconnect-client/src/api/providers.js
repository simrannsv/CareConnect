import api from "./axios";

export async function getProviders(params = {}) {
  const response = await api.get("/providers", { params });
  return response.data;
}

export async function getProviderById(id) {
  const response = await api.get(`/providers/${id}`);
  return response.data;
}

export async function getMyProviderProfile() {
  const response = await api.get("/providers/me");
  return response.data;
}

export async function updateMyProviderProfile(payload) {
  const response = await api.put("/providers/me", payload);
  return response.data;
}

export async function updateMyAvailability(payload) {
  const response = await api.put("/providers/me/availability", payload);
  return response.data;
}

export async function getPendingProviders() {
  const response = await api.get("/providers/pending");
  return response.data;
}

export async function verifyProvider(id, payload) {
  const response = await api.put(`/providers/${id}/verify`, payload);
  return response.data;
}