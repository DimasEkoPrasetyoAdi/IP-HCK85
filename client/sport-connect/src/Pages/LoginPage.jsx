import { useEffect, useState } from "react"
import { useNavigate, Link, useLocation } from "react-router"
import Swal from 'sweetalert2'
import { useAuth } from "../Context/AuthContext"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login, googleLogin } = useAuth()

  // Get the page user was trying to access
  const from = location.state?.from || '/user'

  async function handleCredentialResponse(response) {
    try {
      setLoading(true)
      const result = await googleLogin(response.credential)

      if (result.success) {
        Swal.fire({
          title: 'Welcome!',
          text: 'Google login successful',
          icon: 'success',
          confirmButtonColor: '#00bcd4',
          timer: 2000,
          showConfirmButton: false
        })
        navigate(from, { replace: true })
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.error,
          icon: 'error',
          confirmButtonColor: '#dc2626'
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!window.google) return;
    
    google.accounts.id.initialize({
      client_id: "955195827657-fsa95ju6akrl8cv29a7hovbluigv6m3c.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large", width: "100%" }
    );
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      const result = await login({ email, password })

      if (result.success) {
        Swal.fire({
          title: 'Welcome Back!',
          text: 'Login successful',
          icon: 'success',
          confirmButtonColor: '#00bcd4',
          timer: 2000,
          showConfirmButton: false
        })
        navigate(from, { replace: true })
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.error,
          icon: 'error',
          confirmButtonColor: '#dc2626'
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Something went wrong!',
        icon: 'error',
        confirmButtonColor: '#dc2626'
      })
    } finally {
      setLoading(false)
    }
  }

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
                <p className="text-muted">Welcome back! Please sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit}>
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
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
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
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-custom-primary w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>

                <div className="text-center mb-3">
                  <span className="text-muted">or continue with</span>
                </div>

                <div id="buttonDiv" className="mb-3"></div>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Don't have an account? 
                    <Link to="/register" className="text-decoration-none fw-semibold ms-1">
                      Sign up here
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
  )
}