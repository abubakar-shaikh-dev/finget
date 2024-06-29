import React from "react";
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";

export const RedirectIfAuthenticated = ({ children }) => {
  const navigate = useNavigate();
  const token = useToken();
  React.useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);
  return token ? null : children;
};
