import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />; // Redirect if not logged in
  }

  return children; // Render protected content if logged in
};

export default ProtectedRoute;