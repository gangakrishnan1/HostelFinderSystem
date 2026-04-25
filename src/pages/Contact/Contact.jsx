import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem("hostelhub_feedbacks") || "[]");
    localStorage.setItem(
      "hostelhub_feedbacks",
      JSON.stringify([{ id: Date.now(), ...form }, ...existing])
    );
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="container py-5">
      <h2>Contact & Feedback</h2>
      <p className="text-muted">Share queries, issues, and feedback with the HostelHub team.</p>
      <form className="card border-0 shadow-sm p-4" onSubmit={submit}>
        <label className="form-label">Name</label>
        <input className="form-control mb-3" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <label className="form-label">Email</label>
        <input type="email" className="form-control mb-3" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <label className="form-label">Message</label>
        <textarea className="form-control mb-3" rows="4" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
        <button className="btn btn-primary" type="submit">Send Feedback</button>
        {sent && <div className="alert alert-success mt-3 mb-0">Feedback submitted successfully.</div>}
      </form>
    </div>
  );
}
