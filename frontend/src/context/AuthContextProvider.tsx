import React, { createContext, useEffect, useState } from "react";
import type { AuthResponse, AuthResponseData } from "../types/authResponse";

type AuthContextType = {
  auth: AuthResponseData | null;
  login: (authResponse: AuthResponse) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthContextProviderProps = {
  children: React.ReactNode;
};

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [auth, setAuth] = useState<AuthResponseData | null>(() => {
    const storedAuthData = localStorage.getItem("authData");
    return storedAuthData ? JSON.parse(storedAuthData) : null;
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem("authData", JSON.stringify(auth));
    } else {
      localStorage.removeItem("authData");
    }
  }, [auth]);

  const login = (authResonse: AuthResponse) => {
    setAuth(authResonse?.data ?? null);
  };

  const logout = () => {
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
