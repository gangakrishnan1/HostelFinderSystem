import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo } from "react";
import { useBookings } from "../../context/BookingContext";

export default function AdminDashboard() {
  const { bookings } = useBookings();

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const totalHostels = JSON.parse(localStorage.getItem("hostelhub_admin_hostels") || "[]").length;
    const totalUsers = new Set(bookings.map((b) => b.user)).size;
    const avgRating = 4.3;
    const feedbackCount = JSON.parse(localStorage.getItem("hostelhub_feedbacks") || "[]").length;

    return { totalBookings, totalHostels, totalUsers, avgRating, feedbackCount };
  }, [bookings]);

  const chartData = [
    { name: "Hostels", value: stats.totalHostels || 3 },
    { name: "Bookings", value: stats.totalBookings },
    { name: "Users", value: stats.totalUsers },
    { name: "Feedback", value: stats.feedbackCount },
  ];

  return (
    <div>
      <h3 className="mb-4">Admin Dashboard</h3>
      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="card p-3 shadow-sm border-0"><h6>Total Hostels</h6><h3>{stats.totalHostels || 3}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 shadow-sm border-0"><h6>Total Bookings</h6><h3>{stats.totalBookings}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 shadow-sm border-0"><h6>Total Users</h6><h3>{stats.totalUsers}</h3></div></div>
        <div className="col-md-3"><div className="card p-3 shadow-sm border-0"><h6>Feedback Entries</h6><h3>{stats.feedbackCount}</h3></div></div>
      </div>

      <div className="card shadow-sm border-0 p-3 mb-3">
        <h6>Average Rating</h6>
        <h4>{stats.avgRating} stars</h4>
      </div>

      <div className="card shadow-sm border-0 p-3">
        <h5>Platform Analytics</h5>
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
