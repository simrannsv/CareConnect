import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
  registerUser,
} from "../api/auth";

const AuthContext = createContext(null);

const TOKEN_KEY = "careconnect_token";
const USER_KEY = "careconnect_user";

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const [user, setUser] = useState(getStoredUser);

  const [restoring, setRestoring] = useState(() =>
    Boolean(localStorage.getItem(TOKEN_KEY))
  );

  function saveAuth(authData) {
    const newToken = authData?.token;
    const newUser = authData?.user;

    if (!newToken || !newUser) {
      throw new Error("Invalid authentication response.");
    }

    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("authToken", newToken);

    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  }

  async function login(emailOrPayload, password) {
    const payload =
      typeof emailOrPayload === "object"
        ? emailOrPayload
        : { email: emailOrPayload, password };

    const result = await loginUser(payload);

    saveAuth(result.data);

    return result.data?.user;
  }

  async function register(payload) {
    const result = await registerUser(payload);

    saveAuth(result.data);

    return result.data?.user;
  }

  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (!storedToken) {
        setRestoring(false);
        return;
      }

      try {
        const result = await getCurrentUser();

        const currentUser = result.data;

        localStorage.setItem(
          USER_KEY,
          JSON.stringify(currentUser)
        );

        setUser(currentUser);
      } catch {
        logout();
      } finally {
        setRestoring(false);
      }
    }

    restoreSession();
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      logout();
    }

    window.addEventListener(
      "careconnect:unauthorized",
      handleUnauthorized
    );

    return () => {
      window.removeEventListener(
        "careconnect:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      restoring,
      login,
      register,
      logout,
    }),
    [user, token, restoring]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}