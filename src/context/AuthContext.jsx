import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import { loginUser } from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "hostelhub_token";
const ROLE_KEY = "hostelhub_role";
const USER_KEY = "hostelhub_user";
const REGISTERED_USERS_KEY = "hostelhub_registered_users";

function getRegisteredUsers() {
  const raw = localStorage.getItem(REGISTERED_USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveRegisteredUsers(users) {
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => Cookies.get(TOKEN_KEY) || "");
  const [role, setRole] = useState(() => Cookies.get(ROLE_KEY) || "");
  const [user, setUser] = useState(() => {
    const fromCookie = Cookies.get(USER_KEY);
    return fromCookie ? JSON.parse(fromCookie) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setRole("");
      setUser(null);
      Cookies.remove(ROLE_KEY);
      Cookies.remove(USER_KEY);
    }
  }, [token]);

  const setAuthSession = (data, normalizedRole) => {
    const expiresInDays = 1;
    Cookies.set(TOKEN_KEY, data.token, { expires: expiresInDays });
    Cookies.set(ROLE_KEY, normalizedRole, { expires: expiresInDays });
    Cookies.set(USER_KEY, JSON.stringify(data), { expires: expiresInDays });

    setToken(data.token);
    setRole(normalizedRole);
    setUser(data);
  };

  const login = async (credentials) => {
    setLoading(true);
    try {
      const registeredUsers = getRegisteredUsers();
      const localUser = registeredUsers.find(
        (item) =>
          item.username === credentials.username && item.password === credentials.password
      );

      if (localUser) {
        const data = {
          ...localUser,
          token: `local-${Date.now()}`,
          role: localUser.role || "user",
        };
        const normalizedRole = data.role === "admin" ? "admin" : "user";
        setAuthSession(data, normalizedRole);
        return { success: true, role: normalizedRole };
      }

      const data = await loginUser(credentials);
      const normalizedRole = data.role === "admin" ? "admin" : "user";
      setAuthSession(data, normalizedRole);
      return { success: true, role: normalizedRole };
    } catch (error) {
      return { success: false, message: error.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const users = getRegisteredUsers();
      const exists = users.some((userItem) => userItem.username === payload.username);
      if (exists) {
        return { success: false, message: "Username already exists." };
      }

      const userRecord = {
        id: Date.now(),
        firstName: payload.firstName,
        username: payload.username,
        email: payload.email,
        password: payload.password,
        role: payload.role || "user",
      };

      saveRegisteredUsers([userRecord, ...users]);
      return { success: true };
    } catch (error) {
      return { success: false, message: "Registration failed." };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
    Cookies.remove(USER_KEY);
    setToken("");
    setRole("");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      role,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
    }),
    [token, role, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
