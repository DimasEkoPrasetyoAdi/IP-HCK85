import { Navigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Loading from "./Loading";

export default function PublicRoute({ children, redirectTo = "/user" }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("access_token");
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking
  if (isLoading) {
    return <Loading fullScreen />;
  }

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    // Get the intended destination from location state, default to redirectTo
    const from = location.state?.from || redirectTo;
    return <Navigate to={from} replace />;
  }

  // Not authenticated, show the public page
  return children;
}
