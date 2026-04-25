import { useMemo, useState } from "react";

export default function BookingForm({ hostel, onBook }) {
  const [roomType, setRoomType] = useState(hostel.roomTypes?.[0]?.type || "Single");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const selectedRoom = useMemo(
    () => hostel.roomTypes.find((room) => room.type === roomType),
    [hostel.roomTypes, roomType]
  );

  const totalCost = useMemo(() => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
    return days * selectedRoom.price;
  }, [checkIn, checkOut, selectedRoom]);

  const submitBooking = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) return;

    onBook({ roomType, checkIn, checkOut, totalCost, roomPrice: selectedRoom.price });
  };

  return (
    <form onSubmit={submitBooking} className="card border-0 shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">Book Room</h5>
        <div className="mb-2">
          <label className="form-label">Room Type</label>
          <select
            className="form-select"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            {hostel.roomTypes.map((room) => (
              <option key={room.type} value={room.type}>
                {room.type} - ?{room.price}/night
              </option>
            ))}
          </select>
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Check-in</label>
            <input
              type="date"
              className="form-control"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Check-out</label>
            <input
              type="date"
              className="form-control"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
            />
          </div>
        </div>

        <p className="mt-3 mb-3 fw-bold">Total Cost: ?{totalCost || 0}</p>
        <button className="btn btn-success w-100" type="submit">
          Confirm Booking
        </button>
      </div>
    </form>
  );
}
