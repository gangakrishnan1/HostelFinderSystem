import { useLocation } from "react-router-dom";
import { useBookings } from "../../context/BookingContext";

export default function Bookings() {
  const { bookings, cancelBooking } = useBookings();
  const location = useLocation();
  const confirmation = location.state?.confirmation;

  return (
    <div className="container py-4">
      <h3 className="mb-3">My Bookings</h3>

      {confirmation && (
        <div className="alert alert-success">
          <h5>Your hostel booking has been confirmed.</h5>
          <p className="mb-1">Booking ID: {confirmation.id}</p>
          <p className="mb-1">Hostel: {confirmation.hostelName}</p>
          <p className="mb-1">Dates: {confirmation.checkIn} to {confirmation.checkOut}</p>
          <p className="mb-1">Payment: {confirmation.paymentStatus} via {confirmation.paymentMethod}</p>
          <p className="mb-0">Total: Rs {confirmation.totalCost}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="alert alert-info">No bookings yet.</div>
      ) : (
        <div className="row g-3">
          {bookings.map((booking) => (
            <div className="col-md-6" key={booking.id}>
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <h5>{booking.hostelName}</h5>
                  <p className="mb-1">Booking ID: {booking.id}</p>
                  <p className="mb-1">Room: {booking.roomType}</p>
                  <p className="mb-1">Dates: {booking.checkIn} to {booking.checkOut}</p>
                  <p className="mb-1">Payment: {booking.paymentStatus || "Pending"}</p>
                  <p className="mb-2">Status: <span className="badge bg-secondary">{booking.status}</span></p>
                  <p className="fw-bold">Total: Rs {booking.totalCost}</p>
                  {booking.status !== "Cancelled" && (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => cancelBooking(booking.id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
