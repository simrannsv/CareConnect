import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRequests } from "../../api/requests";
import "../../styles/customer-requests.css";

export default function CustomerRequests() {
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
      const res = await getMyRequests();
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
    <div className="customer-requests">
      <div className="cc-header">
        <h1>My Service Requests</h1>
        <button
          className="cc-btn cc-btn-primary"
          onClick={() => navigate("/customer/requests/new")}
        >
          + New Request
        </button>
      </div>

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
          <p>No requests yet. Start by describing a problem.</p>
          <button
            className="cc-btn cc-btn-primary"
            onClick={() => navigate("/customer/requests/new")}
          >
            Create Your First Request
          </button>
        </div>
      )}

      {!error && requests.length > 0 && (
        <div className="cc-requests-grid">
          {requests.map((req) => (
            <div
              key={req._id}
              className="cc-request-card"
              onClick={() => navigate(`/customer/requests/${req._id}`)}
            >
              <div className="cc-request-header">
                <h3>{req.description?.slice(0, 50)}...</h3>
                <span className={`cc-status cc-status-${req.status}`}>
                  {req.status}
                </span>
              </div>
              <div className="cc-request-meta">
                <p>
                  <strong>Category:</strong>{" "}
                  {req.aiCategory?.name || req.aiCategory || req.category || "General"}
                </p>
                <p>
                  <strong>Location:</strong> {req.location}
                </p>
                <p>
                  <strong>Preferred:</strong>{" "}
                  {req.preferredTime ? new Date(req.preferredTime).toLocaleDateString() : "N/A"}
                </p>
                <p className="cc-date">
                  Created: {new Date(req.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}