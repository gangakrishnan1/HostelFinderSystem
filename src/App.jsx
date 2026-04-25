import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import SkeletonLoader from "./components/SkeletonLoader/SkeletonLoader";
import Footer from "./components/Footer/Footer";

const Home = lazy(() => import("./pages/Home/Home"));
const About = lazy(() => import("./pages/About/About"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const Login = lazy(() => import("./pages/Login/Login"));
const Register = lazy(() => import("./pages/Register/Register"));
const Hostels = lazy(() => import("./pages/Hostels/Hostels"));
const HostelDetails = lazy(() => import("./pages/HostelDetails/HostelDetails"));
const Bookings = lazy(() => import("./pages/Bookings/Bookings"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const Payment = lazy(() => import("./pages/Payment/Payment"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard/AdminDashboard"));
const AdminHostels = lazy(() => import("./admin/AdminHostels/AdminHostels"));
const AdminBookings = lazy(() => import("./admin/AdminBookings/AdminBookings"));
const AddHostel = lazy(() => import("./admin/AddHostel/AddHostel"));

function ProtectedRoute({ roles }) {
  const { isAuthenticated, role, loading } = useAuth();
  if (loading) return <SkeletonLoader type="page" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

function AdminLayout() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 col-lg-2 p-0"><Sidebar /></div>
        <main className="col-md-9 col-lg-10 py-4 px-4 bg-light min-vh-100"><Outlet /></main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <Suspense fallback={<SkeletonLoader type="page" />}>
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute roles={["user", "admin"]} />}>
              <Route path="/hostels" element={<Hostels />} />
              <Route path="/hostel/:id" element={<HostelDetails />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/payment" element={<Payment />} />
            </Route>

            <Route element={<ProtectedRoute roles={["admin"]} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="hostels" element={<AdminHostels />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="add-hostel" element={<AddHostel />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Suspense>
      <Footer />
    </div>
  );
}
