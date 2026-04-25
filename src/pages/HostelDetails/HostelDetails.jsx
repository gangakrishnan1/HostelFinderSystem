import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BookingForm from "../../components/BookingForm/BookingForm";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import { getHostels } from "../../services/api";
import { useWishlist } from "../../context/WishlistContext";

export default function HostelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const hostels = await getHostels();
      const found = hostels.find((item) => String(item.id) === id);
      setHostel(found || null);
      setLoading(false);
    };
    load();
  }, [id]);

  const onBook = (bookingData) => {
    navigate("/payment", {
      state: {
        bookingDraft: {
          hostelId: hostel.id,
          hostelName: hostel.name,
          ...bookingData,
        },
      },
    });
  };

  const onAddReview = (review) => {
    setHostel((prev) => ({ ...prev, reviews: [review, ...(prev.reviews || [])] }));
  };

  if (loading) return <SkeletonLoader type="page" />;
  if (!hostel) return <div className="container py-4">Hostel not found.</div>;

  return (
    <div className="container py-4">
      <div className="row g-4">
        <section className="col-lg-8">
          <h2>{hostel.name}</h2>
          <p className="text-muted">{hostel.location}, {hostel.area} | {hostel.rating} stars</p>

          <div className="row g-2 mb-3">
            {hostel.images?.slice(0, 3).map((img) => (
              <div className="col-md-4" key={img}>
                <img src={img} alt={hostel.name} className="img-fluid rounded details-image" />
              </div>
            ))}
          </div>

          <p>{hostel.description}</p>
          <div className="mb-3">
            {hostel.facilities.map((facility) => (
              <span key={facility} className="badge bg-info-subtle text-dark me-2">{facility}</span>
            ))}
          </div>

          <div className="d-flex gap-2 mb-3">
            <button className="btn btn-outline-danger" onClick={() => toggleWishlist(hostel)}>
              {isWishlisted(hostel.id) ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          <ReviewSection hostel={hostel} onAddReview={onAddReview} />
        </section>

        <aside className="col-lg-4">
          <BookingForm hostel={hostel} onBook={onBook} />
        </aside>
      </div>
    </div>
  );
}
