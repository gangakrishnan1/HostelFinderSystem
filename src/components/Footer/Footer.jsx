import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer border-top bg-white mt-auto">
      <div className="container py-4 d-flex flex-column flex-md-row justify-content-between gap-3">
        <div>
          <h6 className="mb-1">HostelHub</h6>
          <small className="text-muted">Real-world hostel discovery, booking and management.</small>
        </div>
        <div className="d-flex gap-3 small">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/hostels">Hostels</Link>
        </div>
      </div>
    </footer>
  );
}
