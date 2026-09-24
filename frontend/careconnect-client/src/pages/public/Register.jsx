import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    const trimmedName = form.name.trim();
    const trimmedEmail = form.email.trim();

    // Name
    if (!trimmedName) {
      newErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email
    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setServerError("");
  };

  const getRoleRedirect = (user) => {
    if (user?.role === "provider") {
      return "/provider/profile";
    }

    if (user?.role === "admin") {
      return "/admin/categories";
    }

    return "/customer/requests";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const user = await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role || "customer",

        ...(form.phone.trim() && {
          phone: form.phone.trim(),
        }),
      });

      navigate(getRoleRedirect(user), {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create your account. Please try again.";

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">

        {/* Brand */}
        <div className="auth-brand">
          <span className="brand-dot" />
          CareConnect
        </div>


        {/* Heading */}
        <div className="auth-heading">
          <p className="auth-eyebrow">
            Get started
          </p>

          <h1>
            Create your
            <br />
            <span>CareConnect account.</span>
          </h1>

          <p>
            Join CareConnect to find trusted professionals
            or offer your services to customers.
          </p>
        </div>


        {/* Server error */}
        {serverError && (
          <div className="auth-error">
            {serverError}
          </div>
        )}


        <form
          className="auth-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* Name */}
          <div className="form-field">
            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              autoComplete="name"
              disabled={loading}
              className={
                errors.name ? "input-error" : ""
              }
            />

            {errors.name && (
              <span className="field-error">
                {errors.name}
              </span>
            )}
          </div>


          {/* Email */}
          <div className="form-field">
            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={loading}
              className={
                errors.email ? "input-error" : ""
              }
            />

            {errors.email && (
              <span className="field-error">
                {errors.email}
              </span>
            )}
          </div>


          {/* Phone */}
          <div className="form-field">
            <label htmlFor="phone">
              Phone{" "}
              <span className="optional">
                (optional)
              </span>
            </label>

            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone number"
              autoComplete="tel"
              disabled={loading}
            />
          </div>


          {/* Password */}
          <div className="form-field">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              disabled={loading}
              className={
                errors.password ? "input-error" : ""
              }
            />

            {errors.password && (
              <span className="field-error">
                {errors.password}
              </span>
            )}
          </div>


          {/* Role */}
          <div className="form-field">
            <label>
              What would you like to do?
            </label>

            <div className="role-options">

              {/* Customer */}
              <button
                type="button"
                className={`role-option ${
                  form.role === "customer"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    role: "customer",
                  }))
                }
                disabled={loading}
              >
                <span className="role-icon">
                  ⌂
                </span>

                <span>
                  <strong>
                   Hire a Professional
                  </strong>

                  <small>
                    Describe an issue and get quotes from verified pros.
                  </small>
                </span>
              </button>


              {/* Provider */}
              <button
                type="button"
                className={`role-option ${
                  form.role === "provider"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setForm((previous) => ({
                    ...previous,
                    role: "provider",
                  }))
                }
                disabled={loading}
              >
                <span className="role-icon">
                  ✦
                </span>

                <span>
                  <strong>
                    Work as a Provider
                  </strong>

                  <small>
                    Browse local customer requests and send quotes.
                  </small>
                </span>
              </button>

            </div>
          </div>


          {/* Submit */}
          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create account"}
          </button>

        </form>


        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>


        {/* Login */}
        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">
            Sign in
          </Link>
        </p>


        {/* Back */}
        <Link
          to="/"
          className="back-home"
        >
          ← Back to CareConnect
        </Link>

      </section>
    </main>
  );
}