import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "emilys", password: "emilyspass" });
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await login(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate(result.role === "admin" ? "/admin/dashboard" : "/hostels");
  };

  return (
    <div className="container py-5 d-flex justify-content-center">
      <form className="card p-4 shadow-sm border-0 login-form" onSubmit={onSubmit}>
        <h3 className="mb-3">Login</h3>
        <p className="text-muted small">Use registered account or DummyJSON credentials.</p>

        <label className="form-label">Username</label>
        <input className="form-control mb-3" value={form.username} onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))} required />

        <label className="form-label">Password</label>
        <input type="password" className="form-control mb-3" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="small text-muted mt-3 mb-0">
          No account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}
