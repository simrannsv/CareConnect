import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProviderRequests } from "../../api/requests";
import "../../styles/provider-requests.css";

export default function ProviderRequests() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRequests();
    }, []);

    async function loadRequests() {
        try {
            setLoading(true);
            const res = await getProviderRequests();
            setRequests(res.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="cc-loader">Loading...</div>;

    return (
        <div className="provider-requests">
            <h1>Available Service Requests</h1>

            {error && (
                <div className="cc-error">
                    {error}
                    <button className="cc-btn cc-btn-small" onClick={loadRequests}>
                        Retry
                    </button>
                </div>
            )}

            {!error && requests.length === 0 && (
                <div className="cc-empty">
                    <p>No matching requests at the moment.</p>
                </div>
            )}

            {!error && requests.length > 0 && (
                <div className="pr-grid">
                    {requests.map((req) => (
                        <div
                            key={req._id}
                            className="pr-card"
                            onClick={() => navigate(`/provider/requests/${req._id}`)}
                        >
                            <h3>{req.description?.slice(0, 50)}...</h3>
                            <p className="pr-category">
                                {req.aiCategory?.name || req.aiCategory || req.category || "General"}
                            </p>
                            <p>
                                <strong>Location:</strong> {req.location}
                            </p>
                            <p>
                                <strong>Urgency:</strong> {req.urgency || "Normal"}
                            </p>
                            <span className={`cc-status cc-status-${req.status}`}>
                                {req.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
