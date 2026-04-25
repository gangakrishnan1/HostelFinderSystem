import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <header className="hero text-white" style={{ padding: "100px 0 120px" }}>
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-4" style={{ letterSpacing: "-1px" }}>Find Your Perfect Stay</h1>
          <p className="lead mx-auto mb-5" style={{ maxWidth: "700px", opacity: 0.9 }}>
            HostelHub helps students and professionals discover premium hostels with verified facilities, smart filters, map visibility, and secure booking workflows across multiple cities.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold" style={{ color: "var(--brand-primary)" }} to="/hostels">Explore Hostels</Link>
            <Link className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold" to="/register">Join Now</Link>
          </div>
        </div>
      </header>

      <main className="container" style={{ marginTop: "-50px", position: "relative", zIndex: 10 }}>
        <section className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card h-100 p-4 text-center border-0">
              <div className="mb-3">
                <span className="fs-1" role="img" aria-label="city">🏙️</span>
              </div>
              <h5 className="fw-bold mb-3">Multi-City Discovery</h5>
              <p className="text-muted mb-0">Search seamlessly across Hyderabad, Bengaluru, Chennai, and Mumbai with rich filters.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 p-4 text-center border-0">
              <div className="mb-3">
                <span className="fs-1" role="img" aria-label="map">🗺️</span>
              </div>
              <h5 className="fw-bold mb-3">Map & Directions</h5>
              <p className="text-muted mb-0">View all nearby hostels on an interactive map and open locations directly in Google Maps.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 p-4 text-center border-0">
              <div className="mb-3">
                <span className="fs-1" role="img" aria-label="shield">🛡️</span>
              </div>
              <h5 className="fw-bold mb-3">Verified Listings</h5>
              <p className="text-muted mb-0">100% verified properties, real reviews, secure bookings, and transparent pricing.</p>
            </div>
          </div>
        </section>

        <section className="card p-5 mb-5 text-center bg-info-subtle border-0">
          <h3 className="fw-bold mb-3" style={{ color: "#3730a3" }}>Why choose HostelHub?</h3>
          <p className="text-muted mx-auto mb-4" style={{ maxWidth: "800px" }}>
            From discovery to booking to management, HostelHub provides a complete premium ecosystem with modern UI, secure authentication, and scalable workflows for the best hostel experience.
          </p>
          <div>
            <Link to="/about" className="btn btn-primary px-4 py-2 rounded-pill">Learn More About Us</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
