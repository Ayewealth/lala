import { createContext, useContext, useState } from "react";
import { useRouter } from "expo-router";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  const contextData = {
    user,
    setUser,
    authToken,
    setAuthToken,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
  };
  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside AuthContext");
  }

  return value;
};
