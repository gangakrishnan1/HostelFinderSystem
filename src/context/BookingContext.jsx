import { createContext, useContext, useMemo, useState } from "react";

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState(() => {
    const stored = localStorage.getItem("hostelhub_bookings");
    return stored ? JSON.parse(stored) : [];
  });

  const persist = (nextBookings) => {
    setBookings(nextBookings);
    localStorage.setItem("hostelhub_bookings", JSON.stringify(nextBookings));
  };

  const addBooking = (booking) => {
    const next = [booking, ...bookings];
    persist(next);
  };

  const cancelBooking = (id) => {
    const next = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "Cancelled" } : booking
    );
    persist(next);
  };

  const updateStatus = (id, status) => {
    const next = bookings.map((booking) =>
      booking.id === id ? { ...booking, status } : booking
    );
    persist(next);
  };

  const value = useMemo(
    () => ({ bookings, addBooking, cancelBooking, updateStatus }),
    [bookings]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBookings() {
  return useContext(BookingContext);
}
