import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/landing.css";

export default function Landing() {
  useEffect(() => {
    // Handle smooth scrolling from nav links
    const handleNavClick = (e) => {
      if (e.target.textContent === "How it works") {
        e.preventDefault();
        const element = document.getElementById("how-it-works");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      if (e.target.textContent === "Features") {
        e.preventDefault();
        const element = document.getElementById("features");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    const navLinks = document.querySelectorAll("nav a");
    navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

    return () => {
      navLinks.forEach((link) => link.removeEventListener("click", handleNavClick));
    };
  }, []);

  return (
    <main className="landing-page">

      {/* =========================
          HERO
      ========================== */}

      <section className="hero">

        <div className="hero-visual">

          <div className="visual-node visual-left service-card service-neutral">
            <span className="service-icon">🔧</span>
            <span className="service-label">Repair</span>
          </div>

          <div className="visual-node visual-lightbulb service-card service-yellow">
            <span className="service-icon">❄</span>
            <span className="service-label">AC Service</span>
          </div>

          <div className="visual-node visual-blue service-card service-blue">
            <span className="service-icon">🧹</span>
            <span className="service-label">Cleaning</span>
          </div>

          <div className="visual-core">
            <span>✦</span>
            <small>AI MATCH</small>
          </div>

          <div className="visual-node visual-red service-card service-red">
            <span className="service-icon">🔧</span>
            <span className="service-label">Plumbing</span>
          </div>

          <div className="visual-node visual-eyes service-card service-white">
            <span className="service-icon">★</span>
            <span className="service-label">Verified</span>
          </div>

          <div className="visual-node visual-right service-card service-neutral">
            <span className="service-icon">⚡</span>
            <span className="service-label">Urgent</span>
          </div>

        </div>


        <div className="hero-copy">

          <p className="hero-eyebrow">
            From plain descriptions to precise solutions.
          </p>

          <h1>
            Home services
            <br />
            that start with
            <br />
            <span>your problem.</span>
          </h1>

          <p className="hero-description">
            Tell CareConnect what's wrong in your own words.
            AI understands the problem, finds verified providers,
            and lets you compare their quotes before choosing.
          </p>

          <div className="hero-actions">

            <Link
              className="button button-dark button-large"
              to="/register"
            >
              Get started
            </Link>

            <Link
              className="button button-light button-large"
              to="/providers"
            >
              Explore providers
            </Link>

          </div>

        </div>

      </section>


      {/* =========================
          HOW IT WORKS
      ========================== */}

      <section
        className="landing-section"
        id="how-it-works"
      >

        <p className="eyebrow">
          How it works
        </p>

        <h2>
          From problem to provider.
        </h2>

        <div className="steps-grid">

          <article className="step-card">

            <span className="step-number">
              01
            </span>

            <div className="step-icon">
              💬
            </div>

            <h3>
              Describe it naturally
            </h3>

            <p>
              You don't need to know the service name.
              Just explain what's happening in your own words.
            </p>

          </article>


          <article className="step-card">

            <span className="step-number">
              02
            </span>

            <div className="step-icon">
              ✦
            </div>

            <h3>
              AI understands
            </h3>

            <p>
              CareConnect identifies the category,
              required skills, and urgency of your problem.
            </p>

          </article>


          <article className="step-card">

            <span className="step-number">
              03
            </span>

            <div className="step-icon">
              ✓
            </div>

            <h3>
              Compare and choose
            </h3>

            <p>
              See verified providers, understand why
              they match, compare quotes, and choose.
            </p>

          </article>

        </div>

      </section>


      {/* Features Section */}
      <section className="features" id="features">
        <div className="features-container">
          <h2>Why Choose CareConnect?</h2>
          <div className="features-grid">

            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI-Powered Matching</h3>
              <p>Our AI understands your problem and finds the perfect provider match based on skills, location, and availability.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3>Transparent Pricing</h3>
              <p>Compare quotes from multiple verified providers. See exactly why each one is recommended for your job.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">⭐</div>
              <h3>Verified Providers</h3>
              <p>All providers are vetted and verified. Trust ratings and reviews help you choose the best match.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Bookings</h3>
              <p>Book with confidence. Track your job from request to completion with real-time updates.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Plain Language</h3>
              <p>Describe your problem in your own words. No need to know technical service names.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Location Smart</h3>
              <p>Providers matched based on your location and service area. Only relevant providers see your request.</p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          CARECONNECT DIFFERENCE
      ========================== */}

      <section
        className="landing-section feature-section"
        id="features"
      >

        <div className="feature-heading">

          <p className="eyebrow">
            The CareConnect difference
          </p>

          <h2>
            See why they
            <br />
            matched.
            <br />
            Choose who
            <br />
            fixes it.
          </h2>

        </div>


        {/* Matching interface */}

        <div className="match-board">

          {/* Customer problem */}

          <div className="problem-card">

            <span className="board-label">
              CUSTOMER PROBLEM
            </span>

            <p>
              "My AC is leaking water
              from the indoor unit."
            </p>

          </div>


          {/* AI connection */}

          <div className="match-line">

            <span>
              ✦ AI MATCH
            </span>

          </div>


          {/* Provider */}

          <div className="provider-card">

            <div className="provider-content">

              <div className="provider-top">

                <div className="provider-avatar">
                  R
                </div>

                <div className="provider-info">

                  <strong>
                    Ravi's AC Services
                  </strong>

                  <span>
                    ✓ Verified provider
                  </span>

                </div>

              </div>


              <div className="provider-rating">
                ★ 4.8
                <span>
                  {" · AC Specialist"}
                </span>
              </div>

            </div>


            {/* Match score */}

            <div className="match-score">

              <strong>
                92%
              </strong>

              <span>
                match
              </span>

            </div>


            {/* Why this provider matched */}

            <div className="match-reasons">

              <span>
                ✓ AC specialist
              </span>

              <span>
                ✓ Nearby
              </span>

              <span>
                ✓ Available today
              </span>

              <span>
                ✓ 4.8 rating
              </span>

            </div>

          </div>

        </div>


        {/* Explanation */}

        <p className="feature-description">
          Say goodbye to mystery assignments. CareConnect
          translates your problem into a ranked list of verified
          specialists, highlighting skill alignment, location,
          availability, and customer ratings.
        </p>

      </section>

    </main>
  );
}