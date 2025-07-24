import { NavLink, Link } from "react-router"

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <a href="#" className="navbar-brand fw-bold">
          Sport Connect
        </a>
        <div className="ms-auto">
          <Link to="/login" className="btn btn-outline-primary me-2">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  )

}