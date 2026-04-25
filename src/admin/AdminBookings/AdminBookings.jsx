import { useBookings } from "../../context/BookingContext";

export default function AdminBookings() {
  const { bookings, cancelBooking, updateStatus } = useBookings();

  return (
    <div>
      <h3 className="mb-3">Manage Bookings</h3>
      {bookings.length === 0 ? (
        <div className="alert alert-info">No bookings available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th><th>Hostel</th><th>User</th><th>Dates</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.hostelName}</td>
                  <td>{booking.user}</td>
                  <td>{booking.checkIn} to {booking.checkOut}</td>
                  <td>
                    <span className="badge bg-secondary me-2">{booking.status}</span>
                    <select className="form-select form-select-sm d-inline-block w-auto" value={booking.status} onChange={(e) => updateStatus(booking.id, e.target.value)}>
                      <option>Confirmed</option>
                      <option>Checked-In</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => cancelBooking(booking.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
