export default function About() {
  return (
    <div className="container py-5">
      <h2>About HostelHub</h2>
      <p className="text-muted">HostelHub is a smart hostel discovery and management platform for users and administrators.</p>
      <div className="row g-3">
        <div className="col-md-6"><div className="card border-0 shadow-sm p-3"><h5>For Users</h5><p className="mb-0">Search, filter, shortlist, book rooms, make payments, and submit ratings and feedback.</p></div></div>
        <div className="col-md-6"><div className="card border-0 shadow-sm p-3"><h5>For Admins</h5><p className="mb-0">Manage hostel listings, monitor bookings, and review analytics and feedback insights.</p></div></div>
      </div>
    </div>
  );
}
