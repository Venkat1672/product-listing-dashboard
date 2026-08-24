function SearchBar({ search, onSearch }) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search products by name..."
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;