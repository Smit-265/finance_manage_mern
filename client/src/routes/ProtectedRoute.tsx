import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token, loading } = useAuth();

  // While loading, don't render or redirect yet
  if (loading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated — render the protected page
  return <>{children}</>;
};

export default ProtectedRoute;
