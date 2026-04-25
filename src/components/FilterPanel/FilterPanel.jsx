const FACILITIES = ["WiFi", "AC", "Laundry", "Food", "Parking"];

export default function FilterPanel({ filters, onChange, availableCities = ["all"] }) {
  const handleFacilityToggle = (facility) => {
    const exists = filters.facilities.includes(facility);
    const facilities = exists
      ? filters.facilities.filter((item) => item !== facility)
      : [...filters.facilities, facility];

    onChange({ ...filters, facilities });
  };

  return (
    <div className="card border-0 shadow-sm mb-3">
      <div className="card-body">
        <h6 className="fw-bold">Filters</h6>

        <label className="form-label mt-2">Max Price (Rs)</label>
        <input
          type="range"
          min="500"
          max="100000"
          step="100"
          className="form-range"
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
        />
        <small className="text-muted">Up to Rs {filters.maxPrice}</small>

        <label className="form-label mt-3">Minimum Rating</label>
        <select
          className="form-select"
          value={filters.minRating}
          onChange={(e) => onChange({ ...filters, minRating: Number(e.target.value) })}
        >
          <option value={0}>Any</option>
          <option value={3}>3+ stars</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </select>

        <label className="form-label mt-3">Sort By</label>
        <select
          className="form-select"
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
        >
          <option value="default">Recommended</option>
          <option value="priceAsc">Price Low to High</option>
          <option value="priceDesc">Price High to Low</option>
          <option value="highestRated">Highest Rated</option>
        </select>

        <label className="form-label mt-3">City</label>
        <select
          className="form-select"
          value={filters.city || "all"}
          onChange={(e) => onChange({ ...filters, city: e.target.value })}
        >
          {availableCities.map((city) => (
            <option key={city} value={city}>
              {city === "all" ? "All Cities" : city}
            </option>
          ))}
        </select>

        <label className="form-label mt-3">Hostel Type</label>
        <select
          className="form-select"
          value={filters.hostelType}
          onChange={(e) => onChange({ ...filters, hostelType: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="Mens Hostel">Mens Hostel</option>
          <option value="Womens Hostel">Womens Hostel</option>
          <option value="Co-living">Co-living</option>
          <option value="PG">PG</option>
        </select>

        <div className="mt-3">
          <label className="form-label">Facilities</label>
          {FACILITIES.map((facility) => (
            <div className="form-check" key={facility}>
              <input
                className="form-check-input"
                type="checkbox"
                id={facility}
                checked={filters.facilities.includes(facility)}
                onChange={() => handleFacilityToggle(facility)}
              />
              <label className="form-check-label" htmlFor={facility}>
                {facility}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
