import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    getRequestById,
    cancelRequest,
    getRequestQuotes,
    getRequestMatches,
} from "../../api/requests";
import { acceptQuote } from "../../api/quotes";
import "../../styles/request-detail.css";

export default function RequestDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);
    const [acceptingQuote, setAcceptingQuote] = useState(null);

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

            try {
                const matchesRes = await getRequestMatches(id);
                setMatches(matchesRes.data?.matches || []);
            } catch {
                setMatches([]);
            }

            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load request");
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel() {
        if (!window.confirm("Cancel this request? This cannot be undone.")) return;
        try {
            setCancelling(true);
            await cancelRequest(id);
            setRequest({ ...request, status: "closed" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to cancel");
        } finally {
            setCancelling(false);
        }
    }

    async function handleAcceptQuote(quoteId) {
        try {
            setAcceptingQuote(quoteId);
            await acceptQuote(quoteId);
            await loadData();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to accept quote");
        } finally {
            setAcceptingQuote(null);
        }
    }

    if (loading) return <div className="cc-loader">Loading...</div>;
    if (!request) return <div className="cc-error">Request not found</div>;

    return (
        <div className="request-detail">
            <button className="cc-btn-back" onClick={() => navigate(-1)}>
                ← Back
            </button>

            <div className="rd-container">
                <div className="rd-section">
                    <h1>{request.description}</h1>
                    <div className="rd-meta">
                        <span className={`cc-status cc-status-${request.status}`}>
                            {request.status?.toUpperCase()}
                        </span>
                        <span className="rd-date">
                            Created: {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                <div className="rd-section">
                    <h2>Details</h2>
                    <div className="rd-grid">
                        <div>
                            <strong>Location:</strong> {request.location}
                        </div>
                        <div>
                            <strong>Preferred Time:</strong>{" "}
                            {request.preferredTime
                                ? new Date(request.preferredTime).toLocaleString()
                                : "N/A"}
                        </div>
                        <div>
                            <strong>Detected Category:</strong>{" "}
                            <span style={{ fontWeight: 600, color: "#6b46c1" }}>
                                {request.aiCategory?.name || request.aiCategory || request.category || "Auto-detected by CareConnect"}
                            </span>
                        </div>
                        {request.aiSkills && request.aiSkills.length > 0 && (
                            <div>
                                <strong>Skills Needed:</strong> {request.aiSkills.join(", ")}
                            </div>
                        )}
                        {request.urgency && (
                            <div>
                                <strong>Urgency:</strong> {request.urgency}
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Matched Professionals Section */}
                <div className="rd-section">
                    <h2>✦ Recommended Service Professionals ({matches.length})</h2>
                    <p style={{ color: "#666", fontSize: "0.95rem", marginBottom: "1rem" }}>
                        CareConnect AI analyzed your request and found the following top-rated verified professionals in your area:
                    </p>

                    {matches.length === 0 ? (
                        <div className="rd-empty">
                            <p>No matching verified professionals found yet. Local providers will review your request shortly.</p>
                        </div>
                    ) : (
                        <div className="rd-quotes">
                            {matches.map((matchItem) => {
                                const prov = matchItem.provider;
                                return (
                                    <div key={prov._id} className="rd-quote-card" style={{ borderLeft: "4px solid #6b46c1" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <h3>{prov.name}</h3>
                                            <span style={{ backgroundColor: "#f3e8ff", color: "#6b46c1", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: 600 }}>
                                                ✦ {matchItem.score || 85}% Match
                                            </span>
                                        </div>
                                        <p style={{ margin: "0.5rem 0", color: "#555" }}>
                                            {prov.bio || "Verified home service specialist."}
                                        </p>

                                        {matchItem.reasons && matchItem.reasons.length > 0 && (
                                            <div style={{ fontSize: "0.85rem", color: "#2b6cb0", margin: "0.5rem 0" }}>
                                                ✔ {matchItem.reasons.join(" • ")}
                                            </div>
                                        )}

                                        <div className="rd-quote-footer" style={{ marginTop: "0.8rem", paddingTop: "0.8rem", borderTop: "1px solid #eee" }}>
                                            <div>
                                                <span className="rd-quote-price">
                                                    Starting from ₹{prov.basePrice || 350}
                                                </span>
                                                <div style={{ fontSize: "0.85rem", color: "#666" }}>
                                                    ⭐ {prov.ratingAvg || 4.8} ({prov.ratingCount || 12} reviews)
                                                </div>
                                            </div>

                                            <Link
                                                to={`/providers/${prov._id}`}
                                                className="cc-btn cc-btn-primary"
                                                style={{ textDecoration: "none", display: "inline-block", textAlign: "center" }}
                                            >
                                                View Professional Profile →
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {quotes.length > 0 && (
                    <div className="rd-section">
                        <h2>Direct Quotes Received ({quotes.length})</h2>
                        <div className="rd-quotes">
                            {quotes.map((quote) => (
                                <div key={quote._id} className="rd-quote-card">
                                    <h3>{quote.provider?.user?.name || quote.provider?.name || "Provider"}</h3>
                                    <p>{quote.message}</p>
                                    <div className="rd-quote-footer">
                                        <span className="rd-quote-price">₹{quote.price}</span>
                                        {request.status === "quoted" && (
                                            <button
                                                className="cc-btn cc-btn-primary"
                                                onClick={() => handleAcceptQuote(quote._id)}
                                                disabled={acceptingQuote === quote._id}
                                            >
                                                {acceptingQuote === quote._id ? "Accepting..." : "Accept"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {request.status === "open" && (
                    <div className="rd-actions" style={{ marginTop: "2rem" }}>
                        <button
                            className="cc-btn cc-btn-danger"
                            onClick={handleCancel}
                            disabled={cancelling}
                        >
                            {cancelling ? "Cancelling..." : "Cancel Request"}
                        </button>
                    </div>
                )}

                {error && <div className="cc-error">{error}</div>}
            </div>
        </div>
    );
}
