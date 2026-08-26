import React from "react";

function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search products by name..."
      aria-label="Search products by name"
    />
  );
}

export default SearchBar;