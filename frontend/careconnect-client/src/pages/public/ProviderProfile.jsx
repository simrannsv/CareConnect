import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProviderById } from "../../api/providers";
import "../../styles/provider-profile.css";

function capitalizeWords(value) {
  if (!value) return "";

  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return "";
      return (
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
      );
    })
    .join(" ");
}

function getCategoryName(category) {
  if (!category) return "";

  if (typeof category === "object") {
    return category.name || category.title || "";
  }

  return String(category);
}

function getProviderName(provider) {
  return (
    provider?.user?.name ||
    provider?.name ||
    "Service Professional"
  );
}

export default function ProviderProfile() {
  const { id } = useParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProvider = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProviderById(id);

        if (!response?.data) {
          throw new Error("Provider profile not found.");
        }

        setProvider(response.data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load provider profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProvider();
  }, [id]);

  if (loading) {
    return (
      <main className="provider-profile-page">
        <div className="provider-profile-state">
          <div className="provider-profile-loader" />
          <p>Loading provider profile...</p>
        </div>
      </main>
    );
  }

  if (error || !provider) {
    return (
      <main className="provider-profile-page">
        <div className="provider-profile-state provider-profile-error">
          <div className="provider-profile-error-icon">!</div>
          <h2>Profile unavailable</h2>
          <p>
            {error || "We couldn't find this provider."}
          </p>

          <Link
            to="/providers"
            className="provider-profile-back-button"
          >
            ← Back to providers
          </Link>
        </div>
      </main>
    );
  }

  const providerName = getProviderName(provider);
  const initial = providerName.charAt(0).toUpperCase();

  const ratingCount = Number(provider.ratingCount || 0);
  const rating = Number(provider.ratingAvg || 0).toFixed(1);

  const categories = Array.isArray(provider.categories)
    ? provider.categories
    : [];

  const categoryName =
    categories.length > 0
      ? getCategoryName(categories[0])
      : "Home Services";

  const serviceAreas = Array.isArray(provider.serviceAreas)
    ? provider.serviceAreas
    : [];

  const skills = Array.isArray(provider.skills)
    ? provider.skills
    : [];

  return (
    <main className="provider-profile-page">
      <section className="provider-profile-container">
        <Link
          to="/providers"
          className="provider-profile-back"
        >
          ← Back to providers
        </Link>

        <div className="provider-profile-card">
          <div className="provider-profile-hero">
            <div className="provider-profile-avatar">
              {initial}
            </div>

            <div className="provider-profile-heading">
              <div className="provider-profile-name-row">
                <h1>{providerName}</h1>

                <span className="provider-profile-verified">
                  ✓ Verified
                </span>
              </div>

              <p className="provider-profile-category">
                {capitalizeWords(categoryName)}
              </p>

              <div className="provider-profile-rating">
                <span className="rating-star">★</span>

                <strong>
                  {ratingCount > 0 ? rating : "New"}
                </strong>

                {ratingCount > 0 && (
                  <span>
                    ({ratingCount}{" "}
                    {ratingCount === 1 ? "review" : "reviews"})
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="provider-profile-divider" />

          <div className="provider-profile-stats">
            <div className="profile-stat">
              <span>EXPERIENCE</span>
              <strong>
                {provider.experienceYears ?? 0} yrs
              </strong>
            </div>

            <div className="profile-stat">
              <span>STARTING FROM</span>
              <strong>
                ₹{provider.basePrice ?? 0}
              </strong>
            </div>

            <div className="profile-stat">
              <span>RATING</span>
              <strong>
                {ratingCount > 0 ? `${rating}/5` : "New"}
              </strong>
            </div>
          </div>

          <div className="provider-profile-content">
            {provider.bio && (
              <section className="profile-section">
                <span className="profile-section-label">
                  ABOUT
                </span>

                <p className="provider-profile-bio">
                  {provider.bio}
                </p>
              </section>
            )}

            {skills.length > 0 && (
              <section className="profile-section">
                <span className="profile-section-label">
                  SKILLS
                </span>

                <div className="profile-skill-list">
                  {skills.map((skill, index) => (
                    <span key={`${skill}-${index}`}>
                      {capitalizeWords(skill)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {serviceAreas.length > 0 && (
              <section className="profile-section">
                <span className="profile-section-label">
                  SERVICE AREAS
                </span>

                <div className="profile-area-list">
                  {serviceAreas.map((area, index) => (
                    <span key={`${area}-${index}`}>
                      {capitalizeWords(area)}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="provider-profile-footer">
            <div>
              <span className="footer-dot" />
              <span>Verified professional</span>
            </div>

            <Link
              to="/customer/requests/new"
              className="provider-profile-action"
            >
              Describe your problem
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}