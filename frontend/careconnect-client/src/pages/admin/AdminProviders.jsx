import { useEffect, useState } from "react";
import { getPendingProviders, verifyProvider } from "../../api/providers";
import "../../styles/admin-providers.css";

export default function AdminProviders() {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [verifying, setVerifying] = useState(null);

    useEffect(() => {
        loadProviders();
    }, []);

    async function loadProviders() {
        try {
            setLoading(true);
            const res = await getPendingProviders();
            setProviders(res.data || []);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load providers");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerify(id) {
        try {
            setVerifying(id);
            await verifyProvider(id, { isVerified: true });
            await loadProviders();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to verify");
        } finally {
            setVerifying(null);
        }
    }

    async function handleReject(id) {
        try {
            setVerifying(id);
            await verifyProvider(id, { isVerified: false });
            await loadProviders();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reject");
        } finally {
            setVerifying(null);
        }
    }

    if (loading) return <div className="cc-loader">Loading...</div>;

    return (
        <div className="admin-providers">
            <h1>Pending Provider Verification</h1>

            {error && <div className="cc-error">{error}</div>}

            {providers.length === 0 && (
                <div className="cc-empty">
                    <p>No pending providers to verify.</p>
                </div>
            )}

            {providers.length > 0 && (
                <div className="ap-grid">
                    {providers.map((prov) => (
                        <div key={prov._id} className="ap-card">
                            <h3>{prov.user?.name || prov.name || "Provider"}</h3>
                            <p>
                                <strong>Email:</strong> {prov.user?.email || prov.email || "N/A"}
                            </p>
                            <p>
                                <strong>Category:</strong>{" "}
                                {prov.categories
                                    ?.map((c) => (typeof c === "object" ? c.name : c))
                                    .join(", ") || prov.category || "General"}
                            </p>
                            <p className="ap-bio">{prov.bio || "No bio submitted."}</p>
                            <div className="ap-actions">
                                <button
                                    className="cc-btn cc-btn-primary"
                                    onClick={() => handleVerify(prov._id)}
                                    disabled={verifying === prov._id}
                                >
                                    {verifying === prov._id ? "..." : "Verify"}
                                </button>
                                <button
                                    className="cc-btn cc-btn-danger"
                                    onClick={() => handleReject(prov._id)}
                                    disabled={verifying === prov._id}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
