import api from "./axios";

export async function createReview(payload) {
    const response = await api.post("/reviews", payload);
    return response.data;
}

export async function getProviderReviews(providerId) {
    const response = await api.get(`/reviews/provider/${providerId}`);
    return response.data;
}
