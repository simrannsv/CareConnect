import { Navigate, Route, Routes } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

import Landing from "../pages/public/Landing";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import Providers from "../pages/public/Providers";
import ProviderProfile from "../pages/public/ProviderProfile";
import NewRequest from "../pages/customer/NewRequest";
import CustomerRequests from "../pages/customer/CustomerRequests";
import RequestDetail from "../pages/customer/RequestDetail";
import ProviderDashboardProfile from "../pages/provider/ProviderProfile";
import ProviderRequests from "../pages/provider/ProviderRequests";
import ProviderRequestDetail from "../pages/provider/ProviderRequestDetail";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminProviders from "../pages/admin/AdminProviders";
import AdminProvidersVerified from "../pages/admin/AdminProvidersVerified";

export default function AppRoutes() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* =========================
            PUBLIC
        ========================== */}

        <Route
          path="/"
          element={<Landing />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/providers"
          element={<Providers />}
        />

        <Route
          path="/providers/:id"
          element={<ProviderProfile />}
        />


        {/* =========================
            CUSTOMER
        ========================== */}


        <Route
          element={
            <ProtectedRoute
              allowedRoles={["customer"]}
            />
          }
        >
          <Route
            path="/customer/requests"
            element={<CustomerRequests />}
          />

          <Route
            path="/customer/requests/new"
            element={<NewRequest />}
          />

          <Route
            path="/customer/requests/:id"
            element={<RequestDetail />}
          />

          <Route
            path="/customer/*"
            element={
              <Navigate
                to="/customer/requests"
                replace
              />
            }
          />
        </Route>

        {/* =========================
            PROVIDER
        ========================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["provider"]}
            />
          }
        >
          <Route
            path="/provider/profile"
            element={<ProviderDashboardProfile />}
          />

          <Route
            path="/provider/requests"
            element={<ProviderRequests />}
          />

          <Route
            path="/provider/requests/:id"
            element={<ProviderRequestDetail />}
          />

          <Route
            path="/provider/*"
            element={
              <Navigate
                to="/provider/profile"
                replace
              />
            }
          />
        </Route>


        {/* =========================
            ADMIN
        ========================== */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >
          <Route
            path="/admin/categories"
            element={<AdminCategories />}
          />

          <Route
            path="/admin/providers"
            element={<AdminProvidersVerified />}
          />

          <Route
            path="/admin/requests"
            element={<AdminProviders />}
          />

          <Route
            path="/admin/providers/pending"
            element={<AdminProviders />}
          />

          <Route
            path="/admin/*"
            element={
              <Navigate
                to="/admin/categories"
                replace
              />
            }
          />
        </Route>


        {/* =========================
            UNKNOWN ROUTE
        ========================== */}

        <Route
          path="*"
          element={<Landing />}
        />

      </Routes>
    </>
  );
}