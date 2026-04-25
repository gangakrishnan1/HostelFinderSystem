import { useEffect, useState } from "react";

export default function SearchBar({ onSearch, value: externalValue = "" }) {
  const [value, setValue] = useState(externalValue);

  useEffect(() => {
    setValue(externalValue);
  }, [externalValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(value);
    }, 400);

    return () => clearTimeout(timer);
  }, [value, onSearch]);

  return (
    <input
      className="form-control"
      placeholder="Search by city, area, college (e.g. Hyderabad)"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
