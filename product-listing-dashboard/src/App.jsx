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
  // -----------------------------
  // STATE
  // -----------------------------

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("");

  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedProduct, setSelectedProduct] = useState(null);

  const limit = 12;


  // -----------------------------
  // DEBOUNCE SEARCH
  // -----------------------------

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);


  // -----------------------------
  // GET CATEGORIES
  // -----------------------------

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        setCategories(data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);


  // -----------------------------
  // GET PRODUCTS
  // -----------------------------

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts({
          page,
          limit,
          search: debouncedSearch,
          category: selectedCategory,
        });

        setProducts(data.products || []);
        setTotalProducts(data.total || 0);

      } catch (error) {
        console.error(error);

        setProducts([]);
        setTotalProducts(0);

        setError(
          "Failed to load products. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

  }, [page, debouncedSearch, selectedCategory]);


  // -----------------------------
  // SEARCH CHANGE
  // -----------------------------

  const handleSearchChange = (value) => {
    setSearch(value);

    // Go back to first page
    // when searching
    setPage(1);
  };


  // -----------------------------
  // CATEGORY CHANGE
  // -----------------------------

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Go back to first page
    // when category changes
    setPage(1);
  };


  // -----------------------------
  // PAGINATION
  // -----------------------------

  const totalPages = Math.ceil(
    totalProducts / limit
  );


  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <h1>
          Product Listing Dashboard
        </h1>

        <p>
          Explore products using the DummyJSON REST API
        </p>

      </header>


      {/* SEARCH + CATEGORY */}

      <div className="filters">

        <SearchBar
          search={search}
          setSearch={handleSearchChange}
        />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={handleCategoryChange}
        />

      </div>


      {/* ERROR */}

      {error && (
        <div className="error">
          {error}
        </div>
      )}


      {/* LOADING */}

      {loading ? (
        <Loader />
      ) : (
        <ProductGrid
          products={products}
          onProductClick={setSelectedProduct}
        />
      )}


      {/* PAGINATION */}

      {!loading && products.length > 0 && (
        <Pagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}


      {/* PRODUCT MODAL */}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
}

export default App;