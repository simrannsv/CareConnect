import api from "./axios";

export async function createQuote(payload) {
    const response = await api.post("/quotes", payload);
    return response.data;
}

export async function acceptQuote(quoteId) {
    const response = await api.put(`/quotes/${quoteId}/accept`);
    return response.data;
}
