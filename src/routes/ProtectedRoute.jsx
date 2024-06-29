import React from "react";
import { Navigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";

export const ProtectedRoute = ({ children }) => {
  const token = useToken();
  return token ? children : <Navigate to="/login" />;
};
