import { useState } from "react";

const STORAGE_KEY = "hostelhub_admin_hostels";

const initialState = {
  name: "",
  hostelType: "Co-living",
  location: "",
  area: "",
  collegeLocation: "",
  pricePerNight: 1000,
  facilities: "WiFi,Food",
  images: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
  latitude: 17.385,
  longitude: 78.4867,
};

export default function AddHostel() {
  const [form, setForm] = useState(initialState);
  const [success, setSuccess] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    const hostel = {
      id: Date.now(),
      name: form.name,
      hostelType: form.hostelType,
      description: "Newly added by admin",
      location: form.location,
      area: form.area,
      collegeLocation: form.collegeLocation,
      pricePerNight: Number(form.pricePerNight),
      rating: 4,
      facilities: form.facilities.split(",").map((f) => f.trim()),
      images: form.images.split(",").map((img) => img.trim()),
      coordinates: { lat: Number(form.latitude), lng: Number(form.longitude) },
      roomTypes: [
        { type: "Single", price: Number(form.pricePerNight) },
        { type: "Double", price: Number(form.pricePerNight) + 400 },
      ],
      reviews: [],
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify([hostel, ...existing]));
    window.dispatchEvent(new Event("hostelsUpdated"));
    setSuccess(true);
    setForm(initialState);
  };

  return (
    <div>
      <h3 className="mb-3">Add Hostel</h3>
      {success && <div className="alert alert-success">Hostel created successfully.</div>}
      <form className="card border-0 shadow-sm p-3" onSubmit={onSubmit}>
        <div className="row g-3">
          {Object.keys(initialState).map((key) => (
            <div className="col-md-6" key={key}>
              <label className="form-label text-capitalize">{key}</label>
              {key === "hostelType" ? (
                <select
                  className="form-select"
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  required
                >
                  <option value="Mens Hostel">Mens Hostel</option>
                  <option value="Womens Hostel">Womens Hostel</option>
                  <option value="Co-living">Co-living</option>
                  <option value="PG">PG</option>
                </select>
              ) : (
                <input
                  className="form-control"
                  value={form[key]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
                  required
                />
              )}
            </div>
          ))}
        </div>
        <button className="btn btn-primary mt-3" type="submit">Create Hostel</button>
      </form>
    </div>
  );
}
