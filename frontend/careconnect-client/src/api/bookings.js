import api from "./axios";

export async function createBooking(payload) {
    const response = await api.post("/bookings", payload);
    return response.data;
}

export async function getMyBookings(params = {}) {
    const response = await api.get("/bookings/mine", { params });
    return response.data;
}

export async function getBookingById(id) {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
}
