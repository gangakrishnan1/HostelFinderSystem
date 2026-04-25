import { useEffect, useMemo, useState } from "react";
import { getHostels } from "../../services/api";

const STORAGE_KEY = "hostelhub_admin_hostels";

export default function AdminHostels() {
  const [hostels, setHostels] = useState([]);
  const [editHostel, setEditHostel] = useState(null);

  useEffect(() => {
    const load = async () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHostels(JSON.parse(stored));
        return;
      }
      const apiHostels = await getHostels();
      setHostels(apiHostels);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiHostels));
      window.dispatchEvent(new Event("hostelsUpdated"));
    };
    load();
  }, []);

  const counts = useMemo(() => hostels.length, [hostels]);

  const removeHostel = (id) => {
    const next = hostels.filter((hostel) => hostel.id !== id);
    setHostels(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("hostelsUpdated"));
  };

  const saveEdit = (e) => {
    e.preventDefault();
    const next = hostels.map((hostel) => (hostel.id === editHostel.id ? editHostel : hostel));
    setHostels(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("hostelsUpdated"));
    setEditHostel(null);
  };

  return (
    <div>
      <h3 className="mb-3">Manage Hostels ({counts})</h3>

      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th>Name</th><th>Location</th><th>Price</th><th>Rating</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {hostels.map((hostel) => (
              <tr key={hostel.id}>
                <td>{hostel.name}</td>
                <td>{hostel.location}</td>
                <td>?{hostel.pricePerNight}</td>
                <td>{hostel.rating}?</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" data-bs-toggle="modal" data-bs-target="#editHostelModal" onClick={() => setEditHostel(hostel)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeHostel(hostel.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="modal fade" id="editHostelModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Hostel</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            {editHostel && (
              <form onSubmit={saveEdit}>
                <div className="modal-body">
                  <label className="form-label">Name</label>
                  <input className="form-control mb-2" value={editHostel.name} onChange={(e) => setEditHostel((prev) => ({ ...prev, name: e.target.value }))} />
                  <label className="form-label">Location</label>
                  <input className="form-control mb-2" value={editHostel.location} onChange={(e) => setEditHostel((prev) => ({ ...prev, location: e.target.value }))} />
                  <label className="form-label">Price</label>
                  <input className="form-control" type="number" value={editHostel.pricePerNight} onChange={(e) => setEditHostel((prev) => ({ ...prev, pricePerNight: Number(e.target.value) }))} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Save</button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
