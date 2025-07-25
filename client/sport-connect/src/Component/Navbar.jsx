import { Link } from "react-router"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-clean">
      <div className="container">
        <Link to="/" className="navbar-brand-clean">
          Sport Connect
        </Link>
        
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="ms-auto d-flex align-items-center gap-2">
            <Link to="/login" className="btn btn-clean-secondary">
              Login
            </Link>
            <Link to="/register" className="btn btn-clean-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}