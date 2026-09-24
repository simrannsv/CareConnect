import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, user: currentUser, restoring } = useAuth();

  useEffect(() => {
    if (!restoring && currentUser) {
      const fromPath =
        location.state?.from?.pathname ||
        (typeof location.state?.from === "string"
          ? location.state.from
          : null);
      const target = fromPath || getRoleRedirect(currentUser);
      navigate(target, { replace: true });
    }
  }, [currentUser, restoring, navigate, location.state]);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

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
      const loggedUser = await login(
        form.email.trim(),
        form.password
      );

      const fromPath =
        location.state?.from?.pathname ||
        (typeof location.state?.from === "string"
          ? location.state.from
          : null);
      const targetPath = fromPath || getRoleRedirect(loggedUser);

      navigate(targetPath, { replace: true });
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to sign in. Please try again.";

      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <section className="auth-card">

        <div className="auth-brand">
          <span className="brand-dot" />
          CareConnect
        </div>

        <div className="auth-heading">
          <p className="auth-eyebrow">
            Welcome back
          </p>

          <h1>
            Sign in to
            <br />
            <span>CareConnect.</span>
          </h1>

          <p>
            Find the right professional for your
            problem and manage your services in one place.
          </p>
        </div>


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
              placeholder="Enter your password"
              autoComplete="current-password"
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


          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>

        </form>


        <div className="auth-divider">
          <span>or</span>
        </div>


        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register">
            Create one
          </Link>
        </p>


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