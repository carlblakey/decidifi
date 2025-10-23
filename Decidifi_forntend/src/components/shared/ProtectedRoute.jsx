import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAllowed, children, redirectTo = "/" }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} />;
  }
  return children;
};

export default ProtectedRoute;
