export default function SkeletonLoader({ type = "card", count = 1 }) {
  if (type === "page") {
    return (
      <div className="container py-4">
        <div className="skeleton skeleton-title mb-3" />
        <div className="row g-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="col-md-4">
              <div className="skeleton skeleton-card" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return [...Array(count)].map((_, i) => <div key={i} className="skeleton skeleton-card" />);
}
