import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function getRoleHome(role) {
  if (role === "customer") {
    return "/customer/requests";
  }

  if (role === "provider") {
    return "/provider/profile";
  }

  if (role === "admin") {
    return "/admin/categories";
  }

  return "/";
}

export default function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="site-header">
      <div className="navbar">

        <Link
          className="brand"
          to={
            isAuthenticated
              ? getRoleHome(user?.role)
              : "/"
          }
        >
          <span className="brand-mark">
            ●
          </span>

          <span>CareConnect</span>
        </Link>

        <nav
          className="nav-links"
          aria-label="Primary navigation"
        >
          {!isAuthenticated ? (
            <>
              <Link to="/providers">
                Providers
              </Link>

              <a href="/#how-it-works">
                How it works
              </a>

              <a href="/#features">
                Features
              </a>
            </>
          ) : user?.role === "customer" ? (
            <>
              <Link to="/customer/requests">
                My Requests
              </Link>

              <Link to="/customer/request/new">
                New Request
              </Link>

              <Link to="/providers">
                Providers
              </Link>
            </>
          ) : user?.role === "provider" ? (
            <>
              <Link to="/provider/profile">
                Profile
              </Link>

              <Link to="/provider/availability">
                Availability
              </Link>

              <Link to="/provider/requests">
                Requests
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin/categories">
                Categories
              </Link>

              <Link to="/admin/providers">
                Providers
              </Link>

              <Link to="/admin/requests">
                Requests
              </Link>
            </>
          )}
        </nav>

        <div className="nav-actions">
          {!isAuthenticated ? (
            <>
              <Link
                className="button button-light"
                to="/login"
              >
                Sign in
              </Link>

              <Link
                className="button button-dark"
                to="/register"
              >
                Get started
              </Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                {user?.name}
              </span>

              <button
                className="button button-light"
                type="button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}