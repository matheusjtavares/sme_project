import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

import api from "@/api/client";
import type { AuthUser, LoginResponse } from "@/types/auth";
import { AuthContext } from "./AuthContext";
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./tokens";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [initializing, setInitializing] = useState(() => getAccessToken() !== null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    if (!getAccessToken()) {
      return;
    }

    api
      .get<AuthUser>("/auth/user/")
      .then((response) => {
        if (active) setUser(response.data);
      })
      .catch(() => {
        clearTokens();
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setInitializing(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const response = await api.post<LoginResponse>("/auth/login/", {
      username,
      password,
    });
    setTokens(response.data.access, response.data.refresh);
    setUser(response.data.user);
  }, []);

  const logout = useCallback(() => {
    const refresh = getRefreshToken();

    const finish = () => {
      clearTokens();
      setUser(null);
      navigate("/login", { replace: true });
    };

    if (refresh) {
      api.post("/auth/logout/", { refresh }).finally(finish);
    } else {
      finish();
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}