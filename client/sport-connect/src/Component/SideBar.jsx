import { Link, useLocation, useNavigate } from "react-router"
import { useAuth } from "../Context/AuthContext"
import Swal from "sweetalert2"

export default function SideBar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out of your account',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#00bcd4',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            logout();
            Swal.fire({
                title: 'Logged Out!',
                text: 'You have been successfully logged out',
                icon: 'success',
                confirmButtonColor: '#00bcd4',
                timer: 1500,
                showConfirmButton: false
            });
            navigate('/', { replace: true });
        }
    };

    const menuItems = [
        {
            path: '/user',
            icon: 'bi-house',
            label: 'Dashboard'
        },
        {
            path: '/create-session',
            icon: 'bi-plus-circle',
            label: 'Create Session'
        },
        {
            path: '/update-session',
            icon: 'bi-gear',
            label: 'Manage Sessions'
        }
    ];

    return (
        <div className="bg-white border-end vh-100 shadow-sm d-flex flex-column" style={{ width: "260px" }}>
            {/* Header */}
            <div className="p-4 border-bottom">
                <Link to="/" className="text-decoration-none">
                    <h5 className="fw-bold mb-0 text-cyan">
                        <i className="bi bi-trophy me-2"></i>
                        Sport Connect
                    </h5>
                </Link>
                {user && (
                    <div className="d-flex align-items-center mt-3">
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '36px', height: '36px' }}>
                            <i className="bi bi-person text-muted"></i>
                        </div>
                        <div>
                            <div className="fw-medium">{user.name}</div>
                            <small className="text-muted">Welcome back</small>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex-grow-1 p-3">
                <nav>
                    <ul className="list-unstyled">
                        {menuItems.map((item) => (
                            <li key={item.path} className="mb-1">
                                <Link 
                                    to={item.path} 
                                    className={`nav-link d-flex align-items-center p-3 rounded text-decoration-none ${
                                        isActive(item.path) 
                                            ? 'bg-cyan text-white' 
                                            : 'text-dark'
                                    }`}
                                    style={{ transition: 'all 0.2s ease' }}
                                >
                                    <i className={`bi ${item.icon} me-3`}></i>
                                    <span className="fw-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            {/* Footer */}
            <div className="p-3 border-top">
                <button 
                    onClick={handleLogout}
                    className="btn btn-outline-danger w-100"
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                </button>
            </div>
        </div>
    )
}