import React from "react";
// import { useAuthState } from "react-firebase-hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../services/firebase";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <p>loading....</p>;
  if (!user) return <Navigate to={"/login"} replace />;

  return children;
};

export default ProtectedRoute;
