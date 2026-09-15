import { useCallback, useEffect, useMemo, useState } from "react";

import { AuthContext } from "./AuthContext";
import {
  getAuthToken,
  setAuthToken,
  setUnauthorizedHandler,
  fetchMe,
  loginRequest,
  registerRequest
} from "../services/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(Boolean(getAuthToken()));

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  // Log the user out automatically if any request comes back 401.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  // Restore a session from a stored token on first load.
  useEffect(() => {
    if (!getAuthToken()) return undefined;

    let active = true;

    fetchMe()
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) setAuthToken(null);
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await registerRequest(name, email, password);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
