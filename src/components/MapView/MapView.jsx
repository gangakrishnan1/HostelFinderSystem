import { memo, useMemo } from "react";
import { CircleMarker, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ hostels, userLocation }) {
  const map = useMap();
  const bounds = useMemo(() => {
    const hostelBounds = hostels.map((h) => [h.coordinates.lat, h.coordinates.lng]);
    if (userLocation) {
      return [...hostelBounds, [userLocation.lat, userLocation.lng]];
    }
    return hostelBounds;
  }, [hostels, userLocation]);
  if (bounds.length) map.fitBounds(bounds, { padding: [40, 40] });
  return null;
}

function MapView({ hostels = [], userLocation }) {
  const validHostels = useMemo(
    () =>
      hostels
        .map((hostel) => ({
          ...hostel,
          coordinates: {
            lat: Number(hostel?.coordinates?.lat),
            lng: Number(hostel?.coordinates?.lng),
          },
        }))
        .filter(
          (hostel) =>
            Number.isFinite(hostel.coordinates.lat) &&
            Number.isFinite(hostel.coordinates.lng)
        ),
    [hostels]
  );

  const center = validHostels[0]
    ? [validHostels[0].coordinates.lat, validHostels[0].coordinates.lng]
    : [17.385, 78.4867];

  return (
    <div className="map-wrapper rounded overflow-hidden border">
      <MapContainer center={center} zoom={11} className="map-container">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {validHostels.length > 0 && <FitBounds hostels={validHostels} userLocation={userLocation} />}

        {validHostels.map((hostel) => (
          <Marker key={hostel.id} position={[hostel.coordinates.lat, hostel.coordinates.lng]} icon={markerIcon}>
            <Popup>
              <strong>{hostel.name}</strong>
              <p className="mb-1">Rs {hostel.pricePerNight} | {hostel.rating} stars</p>
              <div className="d-flex flex-column gap-1">
                <Link to={`/hostel/${hostel.id}`}>Open details</Link>
                <a href={`https://www.google.com/maps/search/?api=1&query=${hostel.coordinates.lat},${hostel.coordinates.lng}`} target="_blank" rel="noreferrer">Open in Google Maps</a>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && Number.isFinite(userLocation.lat) && Number.isFinite(userLocation.lng) && (
          <CircleMarker center={[userLocation.lat, userLocation.lng]} radius={10} pathOptions={{ color: "#ef4444", fillColor: "#ef4444", fillOpacity: 0.8 }}>
            <Popup>Your current location</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}

export default memo(MapView);
