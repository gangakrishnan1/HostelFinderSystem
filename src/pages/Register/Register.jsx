import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  firstName: "",
  username: "",
  email: "",
  password: "",
  role: "user",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const result = await register(form);
    if (!result.success) {
      setError(result.message);
      return;
    }

    setMessage("Registration successful. You can now login.");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <form className="card p-4 shadow-sm border-0 login-form" onSubmit={onSubmit}>
        <h3 className="mb-3">Create Account</h3>
        <p className="text-muted small">Register as User or Admin to access role-based features.</p>

        <label className="form-label">Full Name</label>
        <input
          className="form-control mb-3"
          value={form.firstName}
          onChange={(e) => onChange("firstName", e.target.value)}
          required
        />

        <label className="form-label">Username</label>
        <input
          className="form-control mb-3"
          value={form.username}
          onChange={(e) => onChange("username", e.target.value)}
          required
        />

        <label className="form-label">Email</label>
        <input
          type="email"
          className="form-control mb-3"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />

        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control mb-3"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          required
        />

        <label className="form-label">Role</label>
        <select
          className="form-select mb-3"
          value={form.role}
          onChange={(e) => onChange("role", e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        {error && <div className="alert alert-danger py-2">{error}</div>}
        {message && <div className="alert alert-success py-2">{message}</div>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="small text-muted mt-3 mb-0">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
