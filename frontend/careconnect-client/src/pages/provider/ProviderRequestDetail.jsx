import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequestById, getRequestQuotes } from "../../api/requests";
import { createQuote } from "../../api/quotes";
import "../../styles/provider-request-detail.css";

export default function ProviderRequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [quoteForm, setQuoteForm] = useState({ price: "", message: "" });

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {
        try {
            setLoading(true);
            const reqRes = await getRequestById(id);
            setRequest(reqRes.data);

            try {
                const quotesRes = await getRequestQuotes(id);
                setQuotes(quotesRes.data || []);
            } catch {
                setQuotes([]);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load request");
        } finally {
            setLoading(false);
        }
    }

    async function handleSendQuote() {
        if (!quoteForm.price || !quoteForm.message) {
            setError("Please fill in price and message");
            return;
        }

        try {
            setSubmitting(true);
            await createQuote({
                requestId: id,
                price: Number(quoteForm.price),
                message: quoteForm.message,
            });
            setQuoteForm({ price: "", message: "" });
            await loadData();
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send quote");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="cc-loader">Loading...</div>;
    if (!request) return <div className="cc-error">Request not found</div>;

    return (
        <div className="provider-request-detail">
            <button className="cc-btn-back" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="prd-container">
                <div className="prd-section">
                    <h1>{request.description}</h1>
                    <p className="prd-category">
                        {request.aiCategory?.name || request.aiCategory || request.category || "General"}
                    </p>
                    <div className="prd-meta">
                        <span>
                            <strong>Location:</strong> {request.location}
                        </span>
                        <span>
                            <strong>Urgency:</strong> {request.urgency || "Normal"}
                        </span>
                        <span>
                            <strong>Preferred:</strong>{" "}
                            {request.preferredTime ? new Date(request.preferredTime).toLocaleString() : "N/A"}
                        </span>
                    </div>
                </div>

                <div className="prd-section">
                    <h2>Existing Quotes ({quotes.length})</h2>
                    {quotes.length === 0 ? (
                        <p>No quotes yet.</p>
                    ) : (
                        <div className="prd-quotes">
                            {quotes.map((q) => (
                                <div key={q._id} className="prd-quote">
                                    <p>
                                        <strong>{q.provider?.user?.name || q.provider?.name || "Provider"}:</strong> ₹{q.price}
                                    </p>
                                    <p>{q.message}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="prd-section prd-quote-form">
                    <h2>Send Your Quote</h2>
                    {error && <div className="cc-error">{error}</div>}
                    <div className="prf-fields">
                        <label>
                            Price (₹)
                            <input
                                type="number"
                                value={quoteForm.price}
                                onChange={(e) => setQuoteForm({ ...quoteForm, price: e.target.value })}
                            />
                        </label>
                        <label>
                            Message
                            <textarea
                                value={quoteForm.message}
                                onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })}
                                placeholder="Tell the customer why you're the right choice..."
                            />
                        </label>
                        <button
                            className="cc-btn cc-btn-primary"
                            onClick={handleSendQuote}
                            disabled={submitting}
                        >
                            {submitting ? "Sending..." : "Send Quote"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
