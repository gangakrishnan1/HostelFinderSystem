import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBookings } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const bookingDraft = location.state?.bookingDraft;
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  if (!bookingDraft) {
    return <div className="container py-4">No booking found for payment.</div>;
  }

  const payNow = () => {
    const booking = {
      id: `BK-${Date.now()}`,
      status: "Confirmed",
      paymentStatus: "Paid",
      paymentMethod,
      user: user?.username || "guest",
      ...bookingDraft,
    };
    addBooking(booking);
    navigate("/bookings", { state: { confirmation: booking } });
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <div className="card shadow-sm border-0 p-4 payment-card">
        <h4>Complete Payment</h4>
        <p className="text-muted mb-2">Hostel: {bookingDraft.hostelName}</p>
        <p className="fw-bold">Amount: Rs {bookingDraft.totalCost}</p>
        <label className="form-label">Payment Method</label>
        <select className="form-select mb-3" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>UPI</option>
          <option>Card</option>
          <option>Net Banking</option>
          <option>Cash at Hostel</option>
        </select>
        <button className="btn btn-success" onClick={payNow}>Pay and Confirm Booking</button>
      </div>
    </div>
  );
}
