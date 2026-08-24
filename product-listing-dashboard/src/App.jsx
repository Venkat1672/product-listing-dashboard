import { useEffect, useState } from "react";

import ProductGrid from "./components/ProductGrid";
import SearchBar from "./components/Searchbar";
import CategoryFilter from "./components/CategoryFilter";
import Pagination from "./components/Pagination";
import ProductModal from "./components/ProductModal";
import Loader from "./components/Loader";

import {
  getProducts,
  getCategories,
} from "./services/productService";

function App() {
  // Product data
  const [products, setProducts] = useState([]);

  // Categories
  const [categories, setCategories] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Error state
  const [error, setError] = useState("");

  // Search state
  const [search, setSearch] = useState("");

  // Category state
  const [selectedCategory, setSelectedCategory] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Selected product for modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Products per page
  const limit = 12;

  // Calculate number of pages
  const totalPages = Math.ceil(totalProducts / limit);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts({
        page,
        limit,
        search,
        category: selectedCategory,
      });

      setProducts(data.products || []);
      setTotalProducts(data.total || 0);
    } catch (error) {
      console.error(error);

      setProducts([]);
      setTotalProducts(0);
      setError("Something went wrong while loading products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load products when page/search/category changes
  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategory]);

  // Load categories once
  useEffect(() => {
    fetchCategories();
  }, []);

  // Search handler
  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // Category handler
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
    setSearch("");
    setPage(1);
  };

  // Pagination handler
  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Retry handler
  const handleRetry = () => {
    fetchProducts();
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>Product Listing Dashboard</h1>

          <p>
            Explore products using the DummyJSON REST API
          </p>
        </div>
      </header>

      <main className="container">
        <section className="controls">
          <SearchBar
            search={search}
            onSearch={handleSearch}
          />

          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </section>

        {loading && <Loader />}

        {!loading && error && (
          <div className="error-container">
            <h2>Oops!</h2>

            <p>{error}</p>

            <button onClick={handleRetry}>
              Retry
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          products.length === 0 && (
            <div className="empty-container">
              <h2>No products found</h2>

              <p>
                Try searching for something else or choose
                another category.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          products.length > 0 && (
            <>
              <ProductGrid
                products={products}
                onViewDetails={setSelectedProduct}
              />

              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}

export default App;