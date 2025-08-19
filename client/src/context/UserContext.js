import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  loginAPI,
  registerAPI,
  socialLoginAPI,
  validateToken,
} from "../utils/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ---------- helpers ----------
  const setLocalAccessToken = (token) => {
    localStorage.setItem("accessToken", token);
  };

  const clearAccessToken = () => {
    localStorage.removeItem("accessToken");
    setAccessToken(null);
    setUser(null);
  };

  // ---------- Auth methods ----------
  const login = async (email, password) => {
    const accessToken = await loginAPI(email, password);
    setAccessToken(accessToken);
    setLocalAccessToken(accessToken);

    const validUser = await validateToken(accessToken);
    if (validUser?.status) {
      setUser(validUser?.user);
      navigate("/", { replace: true });
    }
    return validUser;
  };

  const register = async (email, password, user_type = "user") => {
    return await registerAPI(email, password, user_type);
  };

  const socialLogin = async (provider, token) => {
    try {
      const accessToken = await socialLoginAPI(provider, token);

      setAccessToken(accessToken); // global helper
      setLocalAccessToken(accessToken); // context local state

      // Optionally validate and set user info
      const validUser = await validateToken(accessToken);
      if (validUser?.status) {
        setUser(validUser.user);
        navigate("/", { replace: true });
      }

      // return validUser;
    } catch (err) {
      console.error(`${provider} login failed:`, err.message);
      return null;
    }
  };

  const logout = () => {
    clearAccessToken();
    // navigate("/login");
  };

  // ---------- Initial load ----------
  useEffect(() => {
    const initAuth = async () => {
      const storedAccess = localStorage.getItem("accessToken");
      if (storedAccess) {
        const validUser = await validateToken(storedAccess);
        if (validUser?.status) {
          setAccessToken(storedAccess);
          setUser(validUser?.user);
        } else {
          clearAccessToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        accessToken,
        loading,
        login,
        register,
        socialLogin,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
export const useUser = () => useContext(UserContext);
