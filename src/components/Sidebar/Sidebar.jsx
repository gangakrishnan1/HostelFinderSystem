import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const links = [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/hostels", label: "Manage Hostels" },
    { to: "/admin/bookings", label: "Manage Bookings" },
    { to: "/admin/add-hostel", label: "Add Hostel" },
  ];

  return (
    <aside className="bg-dark text-white min-vh-100 p-3">
      <h5 className="mb-4">Admin Panel</h5>
      <div className="nav flex-column nav-pills">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className="nav-link text-white">
            {link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}
