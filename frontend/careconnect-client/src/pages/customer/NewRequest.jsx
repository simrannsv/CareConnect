import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createRequest } from "../../api/requests";
import { getCategories } from "../../api/categories";
import "../../styles/new-request.css";

export default function NewRequest() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    description: "",
    location: "",
    preferredTime: "",
    category: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();

        setCategories(
          Array.isArray(response?.data)
            ? response.data
            : []
        );
      } catch {
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const validate = () => {
    if (!form.description.trim()) {
      return "Please describe the problem.";
    }

    if (form.description.trim().length < 10) {
      return "Please describe the problem in a little more detail.";
    }

    if (!form.location.trim()) {
      return "Please enter your location.";
    }

    if (!form.preferredTime) {
      return "Please select your preferred time.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        description: form.description.trim(),
        location: form.location.trim(),
        preferredTime: form.preferredTime,
      };

      if (form.category && form.category.trim()) {
        payload.category = form.category;
      }

      const response = await createRequest(payload);

      const requestId =
        response?.data?._id ||
        response?.data?.id;

      if (requestId) {
        navigate(`/customer/requests/${requestId}`);
      } else {
        navigate("/customer/requests");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to create your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-request-page">
      <div className="new-request-container">

        <Link
          to="/customer/requests"
          className="new-request-back"
        >
          ← Back to requests
        </Link>

        <section className="new-request-header">
          <p className="new-request-eyebrow">
            NEW SERVICE REQUEST
          </p>

          <h1>
            Tell us what's
            <br />
            <span>going wrong.</span>
          </h1>

          <p>
            Describe the problem in your own words.
            You don't need to know exactly what service
            you need — CareConnect will help identify it.
          </p>
        </section>

        <form
          className="new-request-form"
          onSubmit={handleSubmit}
        >

          <div className="request-form-section">
            <label htmlFor="description">
              What's the problem?
            </label>

            <p className="field-help">
              Tell us what you're experiencing.
              More detail helps us find the right professional.
            </p>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Example: My AC is leaking water from the indoor unit and it has been happening since yesterday..."
              rows={7}
              maxLength={1000}
              disabled={loading}
            />

            <div className="character-count">
              {form.description.length}/1000
            </div>
          </div>

          <div className="request-form-grid">

            <div className="request-form-section">
              <label htmlFor="category">
                Service category
              </label>

              <p className="field-help">
                Choose the category that best matches your problem.
              </p>

              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                disabled={loading || loadingCategories}
              >
                <option value="">
                  {loadingCategories
                    ? "Loading categories..."
                    : "Select a category"}
                </option>

                {categories.map((category) => {
                  const categoryId =
                    category._id || category.id;

                  const categoryName =
                    category.name ||
                    category.title ||
                    "";

                  return (
                    <option
                      key={categoryId}
                      value={categoryId}
                    >
                      {categoryName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="request-form-section">
              <label htmlFor="location">
                Location
              </label>

              <p className="field-help">
                Where should the professional provide the service?
              </p>

              <input
                id="location"
                name="location"
                type="text"
                value={form.location}
                onChange={handleChange}
                placeholder="Example: Madhapur, Hyderabad"
                maxLength={200}
                disabled={loading}
              />
            </div>

          </div>

          <div className="request-form-section">
            <label htmlFor="preferredTime">
              Preferred time
            </label>

            <p className="field-help">
              When would you like the professional to visit?
            </p>

            <input
              id="preferredTime"
              name="preferredTime"
              type="datetime-local"
              value={form.preferredTime}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="request-form-error">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          <div className="request-form-footer">
            <div className="request-ai-note">
              <span>✦</span>

              <p>
                CareConnect will analyze your request
                and help match you with relevant
                professionals.
              </p>
            </div>

            <button
              type="submit"
              className="request-submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="request-button-spinner" />
                  Creating request...
                </>
              ) : (
                <>
                  Find professionals
                  <span>→</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}