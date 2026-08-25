function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search products by name..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}

export default SearchBar;