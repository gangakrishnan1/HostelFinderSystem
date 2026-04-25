import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";

export default function Wishlist() {
  const { wishlist } = useWishlist();

  return (
    <div className="container py-4">
      <h3>My Wishlist</h3>
      {wishlist.length === 0 ? (
        <div className="alert alert-info">No hostels in wishlist.</div>
      ) : (
        <div className="row g-3">
          {wishlist.map((item) => (
            <div className="col-md-6" key={item.id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-0 text-muted">{item.location}</p>
                  </div>
                  <Link className="btn btn-primary btn-sm" to={`/hostel/${item.id}`}>View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
