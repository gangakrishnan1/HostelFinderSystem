import { useEffect, useMemo, useState } from "react";
import HostelCard from "../../components/HostelCard/HostelCard";
import FilterPanel from "../../components/FilterPanel/FilterPanel";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";
import SkeletonLoader from "../../components/SkeletonLoader/SkeletonLoader";
import { getHostels } from "../../services/api";

const STORAGE_KEY = "hostelhub_admin_hostels";
const SAVED_SEARCHES_KEY = "hostelhub_saved_searches";
const USER_LOCATION_KEY = "hostelhub_user_location";

function isLegacyFakeData(list) {
  if (!Array.isArray(list) || list.length === 0) return false;
  return list.some(
    (item) =>
      String(item?.name || "").toLowerCase().includes("oppo hostel") ||
      String(item?.images?.[0] || "").includes("dummyjson")
  );
}

function distanceInKm(from, to) {
  if (!from || !to) return null;
  const fromLat = Number(from.lat);
  const fromLng = Number(from.lng);
  const toLat = Number(to.lat);
  const toLng = Number(to.lng);
  if (![fromLat, fromLng, toLat, toLng].every(Number.isFinite)) return null;

  const toRad = (val) => (val * Math.PI) / 180;
  const earthRadius = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) *
      Math.cos(toRad(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function inferHostelType(hostel) {
  const explicitType = hostel?.hostelType;
  if (explicitType) return explicitType;

  const name = String(hostel?.name || "").toLowerCase();
  const description = String(hostel?.description || "").toLowerCase();
  const merged = `${name} ${description}`;

  if (merged.includes("ladies") || merged.includes("women") || merged.includes("womens")) {
    return "Womens Hostel";
  }
  if (merged.includes("boys") || merged.includes("mens") || merged.includes("men")) {
    return "Mens Hostel";
  }
  if (merged.includes("co-living") || merged.includes("coliving") || merged.includes("co living")) {
    return "Co-living";
  }
  if (merged.includes("pg")) {
    return "PG";
  }
  return "Co-living";
}

export default function Hostels() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [userLocation, setUserLocation] = useState(() => {
    const stored = localStorage.getItem(USER_LOCATION_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [density, setDensity] = useState("comfortable");
  const [compareIds, setCompareIds] = useState([]);
  const [savedSearches, setSavedSearches] = useState(() => {
    const stored = localStorage.getItem(SAVED_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [filters, setFilters] = useState({
    maxPrice: 100000,
    minRating: 0,
    facilities: [],
    hostelType: "all",
    city: "all",
    sortBy: "default",
  });

  useEffect(() => {
    const loadHostels = async () => {
      setLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored).map((hostel) => ({
          ...hostel,
          hostelType: inferHostelType(hostel),
        }));
        if (isLegacyFakeData(parsed)) {
          const data = await getHostels();
          const normalized = data.map((hostel) => ({
            ...hostel,
            hostelType: inferHostelType(hostel),
          }));
          setHostels(normalized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          setLoading(false);
          return;
        }
        setHostels(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        setLoading(false);
        return;
      }

      const data = await getHostels();
      const normalized = data.map((hostel) => ({
        ...hostel,
        hostelType: inferHostelType(hostel),
      }));
      setHostels(normalized);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      setLoading(false);
    };

    const syncFromStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored).map((hostel) => ({
          ...hostel,
          hostelType: inferHostelType(hostel),
        }));
        setHostels(parsed);
      }
    };

    loadHostels();

    window.addEventListener("storage", syncFromStorage);
    window.addEventListener("hostelsUpdated", syncFromStorage);

    return () => {
      window.removeEventListener("storage", syncFromStorage);
      window.removeEventListener("hostelsUpdated", syncFromStorage);
    };
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (position) => {
        const nextLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(nextLocation);
        localStorage.setItem(USER_LOCATION_KEY, JSON.stringify(nextLocation));
      },
      () => {
        // Keep using last stored location if browser permission denied.
      }
    );
  }, []);

  const availableCities = useMemo(() => {
    const cities = new Set(hostels.map((h) => h.location));
    return ["all", ...Array.from(cities).sort()];
  }, [hostels]);

  const filteredHostels = useMemo(() => {
    let result = [...hostels];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (hostel) =>
          hostel.location.toLowerCase().includes(query) ||
          hostel.area.toLowerCase().includes(query) ||
          hostel.collegeLocation.toLowerCase().includes(query)
      );
    }

    result = result.filter(
      (hostel) =>
        hostel.pricePerNight <= filters.maxPrice &&
        hostel.rating >= filters.minRating &&
        (filters.hostelType === "all" || hostel.hostelType === filters.hostelType) &&
        (filters.city === "all" || hostel.location === filters.city) &&
        filters.facilities.every((facility) => hostel.facilities.includes(facility))
    );

    const enriched = result.map((hostel) => ({
      ...hostel,
      distanceKm: distanceInKm(userLocation, hostel.coordinates),
    }));

    if (filters.sortBy === "default") {
      enriched.sort((a, b) => {
        const aDistance = Number.isFinite(a.distanceKm) ? a.distanceKm : Number.MAX_SAFE_INTEGER;
        const bDistance = Number.isFinite(b.distanceKm) ? b.distanceKm : Number.MAX_SAFE_INTEGER;
        return aDistance - bDistance;
      });
    }
    if (filters.sortBy === "priceAsc") enriched.sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (filters.sortBy === "priceDesc") enriched.sort((a, b) => b.pricePerNight - a.pricePerNight);
    if (filters.sortBy === "highestRated") enriched.sort((a, b) => b.rating - a.rating);

    return enriched;
  }, [hostels, search, filters, userLocation]);

  const totalPages = Math.ceil(filteredHostels.length / itemsPerPage);
  const paginatedHostels = filteredHostels.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filters, itemsPerPage]);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const compareHostels = filteredHostels.filter((hostel) => compareIds.includes(hostel.id));

  const saveCurrentSearch = () => {
    const entry = {
      id: Date.now(),
      label: search || "Recommended Search",
      search,
      filters,
    };
    const next = [entry, ...savedSearches].slice(0, 6);
    setSavedSearches(next);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(next));
  };

  const applySavedSearch = (entry) => {
    setSearch(entry.search);
    setFilters(entry.filters);
  };

  return (
    <div className="container py-4">
      <div className="row g-4">
        <aside className="col-lg-3">
          <div className="card border-0 shadow-sm p-3 mb-3">
            <SearchBar onSearch={setSearch} value={search} />
            <button className="btn btn-outline-primary btn-sm w-100 mt-2" onClick={saveCurrentSearch}>
              Save Search
            </button>
            {savedSearches.length > 0 && (
              <div className="saved-searches mt-2">
                {savedSearches.map((entry) => (
                  <button key={entry.id} className="btn btn-light btn-sm me-2 mb-2 border" onClick={() => applySavedSearch(entry)}>
                    {entry.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <FilterPanel filters={filters} onChange={setFilters} availableCities={availableCities} />
        </aside>

        <section className="col-lg-9">
          <div className="list-toolbar d-flex justify-content-between align-items-center mb-3 gap-2 flex-wrap">
            <div>
              <h3 className="mb-0">Hostel Listings</h3>
              <span className="text-muted">{filteredHostels.length} results</span>
              {userLocation && (
                <div className="small text-success mt-1">Showing nearest hostels first</div>
              )}
            </div>
            <div className="d-flex gap-2 align-items-center">
              <span className="small text-muted">Per Page</span>
              <select
                className="form-select form-select-sm"
                style={{ width: 86 }}
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={6}>6</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <span className="small text-muted">Density</span>
              <button className={`btn btn-sm ${density === "comfortable" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setDensity("comfortable")}>
                Comfortable
              </button>
              <button className={`btn btn-sm ${density === "compact" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setDensity("compact")}>
                Compact
              </button>
            </div>
          </div>

          {loading ? (
            <SkeletonLoader type="page" />
          ) : (
            <>
              {compareHostels.length > 0 && (
                <div className="card border-0 shadow-sm p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">Compare Hostels ({compareHostels.length}/3)</h6>
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => setCompareIds([])}>Clear Compare</button>
                  </div>
                  <div className="row g-2">
                    {compareHostels.map((hostel) => (
                      <div key={hostel.id} className="col-md-4">
                        <div className="border rounded p-2 h-100">
                          <h6 className="mb-1">{hostel.name}</h6>
                          <small className="d-block text-muted">{hostel.location}</small>
                          <small className="d-block">Rs {hostel.pricePerNight}/night</small>
                          <small className="d-block">{hostel.rating} stars</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {paginatedHostels.length === 0 && (
                <div className="alert alert-warning">
                  No hostels found for current filters. Try clearing search or filters.
                </div>
              )}
              <div className="row g-3">
                {paginatedHostels.map((hostel) => (
                  <div className="col-12" key={hostel.id}>
                    <HostelCard
                      hostel={hostel}
                      compact={density === "compact"}
                      selected={compareIds.includes(hostel.id)}
                      canCompare
                      onToggleCompare={toggleCompare}
                    />
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
