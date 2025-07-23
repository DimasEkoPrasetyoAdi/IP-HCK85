
export default function Navbar(){
    
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <a className="navbar-brand text-success fw-bold" href="#">ROVO</a>
        <div className="ms-auto">
          <button className="btn btn-outline-primary me-2">Login</button>
        <button className="btn btn-primary">Sign Up</button>
      </div>
    </div>
  </nav>
  )

}