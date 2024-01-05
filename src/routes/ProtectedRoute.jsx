import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({ children }) => {
  const accessToken = localStorage.getItem('access_token');
  console.log("TOKEN: ", accessToken, "storage: ", localStorage);
  if (!accessToken) {
    return <Navigate to="/login" replace/>;
  }
  return children;
};