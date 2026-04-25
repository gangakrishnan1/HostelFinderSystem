import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

function HostelCard({
  hostel,
  compact = false,
  selected = false,
  canCompare = false,
  onToggleCompare,
}) {
  const { toggleWishlist, isWishlisted } = useWishlist();
  const googleQuery = encodeURIComponent(`${hostel.name}, ${hostel.location}`);
  const googleUrl = `https://www.google.com/maps/search/?api=1&query=${googleQuery}`;

  return (
    <article className={`card border-0 hostel-card hostel-card-list ${compact ? "hostel-card-compact" : ""} ${selected ? "hostel-card-selected" : ""}`}>
      <div className="row g-0">
        <div className="col-md-4">
          <img src={hostel.images?.[0]} className="hostel-image-list" alt={hostel.name} />
        </div>
        <div className="col-md-8">
          <div className="card-body d-flex flex-column h-100">
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <h5 className="card-title mb-1">{hostel.name}</h5>
                <p className="card-text text-muted small mb-2">
                  {hostel.location}, {hostel.area}
                </p>
                <span className="badge bg-info-subtle text-dark border mb-2">{hostel.hostelType}</span>
              </div>
              <div className="text-end">
                <p className="mb-1 fw-bold text-primary">Rs {hostel.pricePerNight}/night</p>
                <span className="badge bg-success">{hostel.rating} stars</span>
                {Number.isFinite(hostel.distanceKm) && (
                  <div className="small text-muted mt-1">{hostel.distanceKm.toFixed(1)} km away</div>
                )}
              </div>
            </div>

            <p className="card-text small mb-2 flex-grow-1">{hostel.description}</p>

            <div className="mb-3">
              {hostel.facilities?.slice(0, 5).map((facility) => (
                <span key={facility} className="badge bg-light text-dark border me-1 mb-1">
                  {facility}
                </span>
              ))}
            </div>

            <div className="d-flex flex-wrap gap-2">
              <Link className="btn btn-primary btn-sm" to={`/hostel/${hostel.id}`}>View Details</Link>
              <button className="btn btn-outline-danger btn-sm" onClick={() => toggleWishlist(hostel)}>
                {isWishlisted(hostel.id) ? "Wishlisted" : "Add Wishlist"}
              </button>
              <a className="btn btn-outline-primary btn-sm" href={googleUrl} target="_blank" rel="noreferrer">
                View on Google
              </a>
              {canCompare && (
                <button className={`btn btn-sm ${selected ? "btn-dark" : "btn-outline-dark"}`} onClick={() => onToggleCompare?.(hostel.id)}>
                  {selected ? "Compared" : "Compare"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default HostelCard;
