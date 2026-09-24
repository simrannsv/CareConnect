import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProviders } from "../../api/providers";
import "../../styles/providers.css";

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

export default function Providers() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [flippedCards, setFlippedCards] = useState({});
  const [poppedCards, setPoppedCards] = useState({});

  const loadProviders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getProviders();

      setProviders(
        Array.isArray(response?.data)
          ? response.data
          : []
      );
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load providers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const toggleCard = (providerId) => {
    // Small visual pop so users notice the card is interactive
    setPoppedCards((previous) => ({
      ...previous,
      [providerId]: true,
    }));

    // Flip the card
    setFlippedCards((previous) => ({
      ...previous,
      [providerId]: !previous[providerId],
    }));

    // Remove the pop after the short animation
    setTimeout(() => {
      setPoppedCards((previous) => ({
        ...previous,
        [providerId]: false,
      }));
    }, 220);
  };

  const handleCardKeyDown = (event, providerId) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      toggleCard(providerId);
    }
  };

  return (
    <main className="providers-page">

      {/* =========================
          HEADER
      ========================== */}

      <section className="providers-header">

        <p className="providers-eyebrow">
          VERIFIED PROFESSIONALS
        </p>

        <h1>
          Find someone who
          <br />
          <span>knows the job.</span>
        </h1>

        <p>
          Browse verified service professionals and find
          the right person for your home service needs.
        </p>

      </section>


      {/* =========================
          CONTENT
      ========================== */}

      <section className="providers-content">

        {/* Loading */}

        {loading && (
          <div className="providers-state">
            <div className="providers-loader" />

            <p>
              Finding verified professionals...
            </p>
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="providers-state providers-error">

            <h3>
              Something went wrong.
            </h3>

            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={loadProviders}
            >
              Try again
            </button>

          </div>
        )}


        {/* Empty */}

        {!loading &&
          !error &&
          providers.length === 0 && (
            <div className="providers-state">

              <div className="empty-icon">
                ✦
              </div>

              <h3>
                No providers available yet
              </h3>

              <p>
                Verified professionals will appear here
                once they become available.
              </p>

            </div>
          )}


        {/* Providers */}

        {!loading &&
          !error &&
          providers.length > 0 && (
            <div className="providers-grid">

              {providers.map((provider) => {
                const providerId =
                  provider._id || provider.id;

                const providerName =
                  getProviderName(provider);

                const initial =
                  providerName
                    .charAt(0)
                    .toUpperCase();

                const ratingCount =
                  Number(provider.ratingCount || 0);

                const rating =
                  Number(
                    provider.ratingAvg || 0
                  ).toFixed(1);

                const categories =
                  Array.isArray(provider.categories)
                    ? provider.categories
                    : [];

                const categoryName =
                  categories.length > 0
                    ? getCategoryName(categories[0])
                    : "Home Services";

                const serviceAreas =
                  Array.isArray(provider.serviceAreas)
                    ? provider.serviceAreas
                    : [];

                const skills =
                  Array.isArray(provider.skills)
                    ? provider.skills
                    : [];

                const visibleSkills =
                  skills.slice(0, 4);

                const remainingSkills =
                  Math.max(
                    skills.length - 4,
                    0
                  );

                const isFlipped =
                  Boolean(
                    flippedCards[providerId]
                  );

                const isPopped =
                  Boolean(
                    poppedCards[providerId]
                  );

                return (
                  <article
                    key={providerId}
                    className={`provider-flip-card ${
                      isFlipped
                        ? "is-flipped"
                        : ""
                    } ${
                      isPopped
                        ? "is-popped"
                        : ""
                    }`}
                    tabIndex="0"
                    role="button"
                    aria-pressed={isFlipped}
                    aria-label={`${
                      isFlipped
                        ? "Show front of"
                        : "Show details for"
                    } ${providerName}`}
                    onClick={() =>
                      toggleCard(providerId)
                    }
                    onKeyDown={(event) =>
                      handleCardKeyDown(
                        event,
                        providerId
                      )
                    }
                  >

                    <div className="provider-flip-inner">

                      {/* =========================
                          FRONT
                      ========================== */}

                      <div className="provider-card-face provider-card-front">

                        <div className="provider-front-avatar">
                          {initial}
                        </div>

                        <h2>
                          {providerName}
                        </h2>

                        <p className="provider-front-rating">
                          ★{" "}
                          {ratingCount > 0
                            ? `${rating} (${ratingCount})`
                            : "New"}
                        </p>

                      </div>


                      {/* =========================
                          BACK
                      ========================== */}

                      <div className="provider-card-face provider-card-back">

                        <div className="provider-back-top">

                          <span className="provider-category">
                            {capitalizeWords(
                              categoryName
                            )}
                          </span>

                          <span className="verified-badge">
                            ✓ Verified
                          </span>

                        </div>


                        <div className="provider-back-stats">

                          <div>
                            <span>
                              Experience
                            </span>

                            <strong>
                              {provider.experienceYears ??
                                0}{" "}
                              yrs
                            </strong>
                          </div>

                          <div>
                            <span>
                              Starting
                            </span>

                            <strong>
                              ₹
                              {provider.basePrice ??
                                0}
                            </strong>
                          </div>

                        </div>


                        {serviceAreas.length > 0 && (
                          <div className="provider-back-section">

                            <span className="back-label">
                              SERVICE AREA
                            </span>

                            <p className="provider-areas">
                              {serviceAreas
                                .map(capitalizeWords)
                                .join(" · ")}
                            </p>

                          </div>
                        )}


                        {skills.length > 0 && (
                          <div className="provider-back-section">

                            <span className="back-label">
                              SKILLS
                            </span>

                            <div className="provider-skills">

                              {visibleSkills.map(
                                (skill, index) => (
                                  <span
                                    key={`${skill}-${index}`}
                                  >
                                    {capitalizeWords(
                                      skill
                                    )}
                                  </span>
                                )
                              )}

                              {remainingSkills > 0 && (
                                <span className="more-skill">
                                  +{remainingSkills} more
                                </span>
                              )}

                            </div>

                          </div>
                        )}


                        {provider.bio && (
                          <p className="provider-back-bio">
                            {provider.bio}
                          </p>
                        )}


                        <Link
                          to={`/providers/${providerId}`}
                          className="provider-view-button"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          onKeyDown={(event) =>
                            event.stopPropagation()
                          }
                        >
                          <span>
                            View profile
                          </span>

                          <span>
                            →
                          </span>
                        </Link>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>
          )}

      </section>

    </main>
  );
}