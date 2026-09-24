import api from "./axios";

export async function createRequest(payload) {
  const response = await api.post("/requests", payload);
  return response.data;
}

export async function getMyRequests(params = {}) {
  const response = await api.get("/requests/mine", { params });
  return response.data;
}

export async function getRequests() {
  const response = await api.get("/requests");
  return response.data;
}

export async function getRequestById(id) {
  const response = await api.get(`/requests/${id}`);
  return response.data;
}

export async function cancelRequest(id) {
  const response = await api.put(`/requests/${id}/cancel`);
  return response.data;
}

export async function getRequestMatches(id) {
  const response = await api.get(`/requests/${id}/matches`);
  return response.data;
}

export async function getRequestQuotes(id) {
  const response = await api.get(`/requests/${id}/quotes`);
  return response.data;
}

export async function getProviderRequests(params = {}) {
  const response = await api.get("/requests", { params });
  return response.data;
}

export async function getMyBookings() {
  const response = await api.get("/bookings/mine");
  return response.data;
}

export async function getBookingById(id) {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
}

export async function createReview(payload) {
  const response = await api.post("/reviews", payload);
  return response.data;
}

export async function getProviderReviews(providerId) {
  const response = await api.get(`/reviews/provider/${providerId}`);
  return response.data;
}