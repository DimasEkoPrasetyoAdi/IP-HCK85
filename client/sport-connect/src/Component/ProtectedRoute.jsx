import { Navigate, Outlet, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Loading from "./Loading";

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login", 
  requireAuth = true,
  loadingComponent = null 
}) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Optional: Verify token with backend
        // const response = await http.get('/verify-token', {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        
        setIsAuthenticated(true);
      } catch (error) {
        // Token invalid, remove it
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name");
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return loadingComponent || (
      <Loading message="Checking authentication..." fullScreen />
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    // Save attempted URL for redirect after login
    return <Navigate 
      to={redirectTo} 
      state={{ from: location.pathname }} 
      replace 
    />;
  }

  // For non-auth routes (like login/register when already logged in)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/user" replace />;
  }

  // Render children or Outlet
  return children ? children : <Outlet />;
}
