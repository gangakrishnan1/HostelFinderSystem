import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Navbar() {
  const { isAuthenticated, role, logout, user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          HostelHub
        </Link>

        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-lg-2 align-items-lg-center">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/hostels">Hostels</NavLink></li>
            {isAuthenticated && <li className="nav-item"><NavLink className="nav-link" to="/bookings">Bookings</NavLink></li>}
            {isAuthenticated && <li className="nav-item"><NavLink className="nav-link" to="/wishlist">Wishlist ({wishlist.length})</NavLink></li>}
            {role === "admin" && <li className="nav-item"><NavLink className="nav-link" to="/admin/dashboard">Admin</NavLink></li>}

            {!isAuthenticated ? (
              <li className="nav-item d-flex gap-2 ms-lg-3 mt-2 mt-lg-0">
                <NavLink className="btn btn-outline-primary btn-sm px-4 rounded-pill" to="/login">Login</NavLink>
                <NavLink className="btn btn-primary btn-sm px-4 rounded-pill" to="/register">Register</NavLink>
              </li>
            ) : (
              <li className="nav-item d-flex align-items-center gap-3 ms-lg-3 mt-2 mt-lg-0">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark small">{user?.firstName || "User"}</span>
                  <span className="badge bg-info-subtle">{role || "user"}</span>
                </div>
                <button className="btn btn-outline-danger btn-sm rounded-pill px-3" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
