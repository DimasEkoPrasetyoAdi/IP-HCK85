import { BrowserRouter, Routes, Route } from "react-router";
import PubPage from "./Pages/PubPage";
import UserPage from "./Pages/UserPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import SessionCreate from "./Pages/SessionCreate";
import SessionUser from "./Pages/SessionUser";
import SessionEdit from "./Pages/SessionEdit";
import ProtectedRoute from "./Component/ProtectedRoute";
import PublicRoute from "./Component/PublicRoute";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        
          <Route path="/" element={<PubPage />} />

          <Route path="/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />

         
          <Route element={<ProtectedRoute />}>
            <Route path="/user" element={<UserPage />} />
            <Route path="/create-session" element={<SessionCreate type="add" />} />
            <Route path="/update-session" element={<SessionUser />} />
            <Route path="/sessions/:id/edit" element={<SessionEdit type="edit" />} />
          </Route>

          <Route path="*" element={
            <div className="min-vh-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <h1 className="display-1 fw-bold text-cyan">404</h1>
                <h4 className="mb-3">Page Not Found</h4>
                <p className="text-muted mb-4">The page you're looking for doesn't exist.</p>
                <a href="/" className="btn btn-cyan">
                  <i className="bi bi-house me-2"></i>
                  Back to Home
                </a>
              </div>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
