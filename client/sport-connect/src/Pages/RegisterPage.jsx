import { useState } from "react";
import { useNavigate, Link } from "react-router";
import Swal from 'sweetalert2';
import http from "../lib/http";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await http.post('/register', {
        email, password, name
      });

      Swal.fire({
        title: 'Welcome to Sport Connect!',
        text: 'Registration successful. Please login to continue.',
        icon: 'success',
        confirmButtonColor: '#00bcd4'
      });

      navigate('/login');

    } catch (error) {
      Swal.fire({
        title: 'Registration Failed',
        text: error.response?.data?.message || 'Something went wrong!',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #00bcd4, #00acc1)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card card-custom glass-effect p-4">
              <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none">
                  <h2 className="text-gradient fw-bold">
                    <i className="bi bi-trophy-fill me-2"></i>
                    Sport Connect
                  </h2>
                </Link>
                <p className="text-muted">Join our community of athletes and sports enthusiasts</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label fw-semibold">
                    <i className="bi bi-person me-2"></i>
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="form-control-custom form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label fw-semibold">
                    <i className="bi bi-envelope me-2"></i>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control-custom form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold">
                    <i className="bi bi-lock me-2"></i>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    className="form-control-custom form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    minLength="6"
                  />
                  <small className="text-muted">Minimum 6 characters</small>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-custom-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus me-2"></i>
                      Create Account
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account? 
                    <Link to="/login" className="text-decoration-none fw-semibold ms-1">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            <div className="text-center mt-3">
              <Link to="/" className="text-white text-decoration-none">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
