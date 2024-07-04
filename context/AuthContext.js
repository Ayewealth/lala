import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userDetails, setUserDetails] = useState([]);

  const navigate = useRouter();

  const loadAuthData = async () => {
    const storedAuthTokens = await AsyncStorage.getItem("authToken");
    const decodedAccess = await AsyncStorage.getItem("decodedAccess");
    const userDetails = await AsyncStorage.getItem("userDetails");

    if (storedAuthTokens) {
      const tokens = JSON.parse(storedAuthTokens);
      setAuthToken(tokens);
      setIsAuthenticated(true);
    }
    if (decodedAccess) {
      const decode = JSON.parse(decodedAccess);
      setUser(decode);
    }
    if (userDetails) {
      const details = JSON.parse(userDetails);
      setUserDetails(details);
    }
  };

  useEffect(() => {
    if (authToken === null || authToken === undefined) {
      loadAuthData();
    }
  }, []);

  const logoutUser = async () => {
    await AsyncStorage.removeItem("isAuthenticated");
    await AsyncStorage.removeItem("userDetails");
    await AsyncStorage.removeItem("decodedAccess");
    await AsyncStorage.removeItem("authToken");

    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateToken = async () => {
    console.log("Token Updated");
    let response = await fetch(
      "https://lala-voice.onrender.com/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: authToken?.refresh }),
      }
    );
    const data = await response.json();

    if (response.status === 200) {
      const decode = jwtDecode(data.access);

      setAuthToken(data);
      setUser(decode);
      await AsyncStorage.setItem("authToken", JSON.stringify(data));
      await AsyncStorage.setItem("decodedAccess", JSON.stringify(decode));
    } else {
      logoutUser();
    }
  };

  useEffect(() => {
    const mins = 1000 * 60 * 5;
    const interval = setInterval(() => {
      if (authToken) {
        updateToken();
      }
    }, mins);
    return () => clearInterval(interval);
  }, [authToken]);

  const contextData = {
    user,
    setUser,
    authToken,
    setAuthToken,
    isAuthenticated,
    setIsAuthenticated,
    loading,
    setLoading,
    logoutUser,

    userDetails,
    setUserDetails,
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
