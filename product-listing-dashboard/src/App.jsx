import { useEffect, useState } from "react";

import SearchBar from "./components/Searchbar";
import ProductModal from "./components/ProductModal";
import Loader from "./components/Loader";

import {
  getProducts,
  getCategories,
} from "./services/productService";

import "./App.css";

function App() {
  // =========================================
  // PRODUCTS
  // =========================================

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // =========================================
  // SEARCH
  // =========================================

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // =========================================
  // CATEGORY
  // =========================================

  const [selectedCategory, setSelectedCategory] = useState("");

  // =========================================
  // SORT
  // =========================================

  const [sort, setSort] = useState("default");

  // =========================================
  // PAGINATION
  // =========================================

  const [page, setPage] = useState(1);

  const limit = 12;

  // =========================================
  // LOADING / ERROR
  // =========================================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =========================================
  // MODAL
  // =========================================

  const [selectedProduct, setSelectedProduct] = useState(null);

  // =========================================
  // FAVORITES
  // =========================================

  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites =
        localStorage.getItem("favoriteProducts");

      return savedFavorites
        ? JSON.parse(savedFavorites)
        : [];
    } catch (error) {
      console.error(
        "Failed to load favorites:",
        error
      );

      return [];
    }
  });

  // =========================================
  // FAVORITES PAGE
  // =========================================

  const [showFavorites, setShowFavorites] =
    useState(false);

  // =========================================
  // SAVE FAVORITES
  // =========================================

  useEffect(() => {
    try {
      localStorage.setItem(
        "favoriteProducts",
        JSON.stringify(favorites)
      );
    } catch (error) {
      console.error(
        "Failed to save favorites:",
        error
      );
    }
  }, [favorites]);

  // =========================================
  // DEBOUNCE SEARCH
  // =========================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // =========================================
  // FETCH PRODUCTS
  // =========================================

  useEffect(() => {
    if (showFavorites) {
      return;
    }

    fetchProducts();
  }, [
    page,
    debouncedSearch,
    selectedCategory,
    showFavorites,
  ]);

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

  // =========================================
  // FETCH CATEGORIES
  // =========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data || []);
    } catch (error) {
      console.error(error);

      setCategories([]);
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // =========================================
  // CATEGORY
  // =========================================

  const handleCategoryChange = (value) => {
    if (
      value === "" ||
      value === "All Categories"
    ) {
      setSelectedCategory("");
    } else {
      setSelectedCategory(value);
    }

    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  // =========================================
  // SORT
  // =========================================

  const handleSortChange = (value) => {
    setSort(value);
  };

  // =========================================
  // FAVORITE CHECK
  // =========================================

  const isFavorite = (productId) => {
    return favorites.some(
      (product) => product.id === productId
    );
  };

  // =========================================
  // TOGGLE FAVORITE
  // =========================================

  const toggleFavorite = (product) => {
    setFavorites((previousFavorites) => {
      const alreadyFavorite =
        previousFavorites.some(
          (item) => item.id === product.id
        );

      // REMOVE
      if (alreadyFavorite) {
        return previousFavorites.filter(
          (item) => item.id !== product.id
        );
      }

      // ADD
      return [
        ...previousFavorites,
        product,
      ];
    });
  };

  // =========================================
  // OPEN FAVORITES
  // =========================================

  const openFavorites = () => {
    setShowFavorites(true);
    setSelectedProduct(null);
  };

  // =========================================
  // BACK TO BROWSING
  // =========================================

  const backToBrowsing = () => {
    setShowFavorites(false);
    setPage(1);
  };

  // =========================================
  // SORT PRODUCTS
  // =========================================

  const sortedProducts = [
    ...(showFavorites
      ? favorites
      : products),
  ].sort((a, b) => {
    if (sort === "price-low") {
      return a.price - b.price;
    }

    if (sort === "price-high") {
      return b.price - a.price;
    }

    if (sort === "rating-high") {
      return b.rating - a.rating;
    }

    return 0;
  });

  // =========================================
  // PAGINATION
  // =========================================

  const totalPages = Math.ceil(
    totalProducts / limit
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1) {
      return;
    }

    if (newPage > totalPages) {
      return;
    }

    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================
  // PAGE NUMBERS
  // =========================================

  const getPageNumbers = () => {
    if (totalPages <= 4) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (page <= 2) {
      return [
        1,
        2,
        3,
        "...",
      ];
    }

    if (page >= totalPages - 1) {
      return [
        "...",
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      "...",
      page - 1,
      page,
      page + 1,
      "...",
    ];
  };

  // =========================================
  // PRODUCT CARD
  // =========================================

  const ProductCard = ({ product }) => {
    const favorite =
      isFavorite(product.id);

    return (
      <div
        className="product-card"
        key={product.id}
      >
        {/* IMAGE */}

        <div
          className="product-image-container"
          style={{
            position: "relative",
          }}
        >
          <img
            src={
              product.thumbnail ||
              product.images?.[0]
            }
            alt={product.title}
            onError={(e) => {
              e.currentTarget.style.display =
                "none";
            }}
          />

          {/* FAVORITE STAR */}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product);
            }}
            aria-label={
              favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            title={
              favorite
                ? "Remove from favorites"
                : "Add to favorites"
            }
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",

              width: "36px",
              height: "36px",

              border: "none",
              borderRadius: "50%",

              background: "#ffffff",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              cursor: "pointer",

              fontSize: "20px",

              color: favorite
                ? "#f59e0b"
                : "#64748b",

              boxShadow:
                "0 2px 8px rgba(0,0,0,0.08)",

              zIndex: 5,

              transition:
                "all 0.2s ease",
            }}
          >
            {favorite ? "★" : "☆"}
          </button>
        </div>

        {/* PRODUCT CONTENT */}

        <div className="product-card-content">

          {/* CATEGORY */}

          <span className="category">
            {product.category}
          </span>

          {/* TITLE */}

          <h3>
            {product.title}
          </h3>

          {/* DESCRIPTION */}

          <p>
            {product.description}
          </p>

          {/* PRICE + RATING */}

          <div className="product-card-price">
            <strong>
              ${product.price}
            </strong>

            <span className="product-card-rating">
              ★ {product.rating}
            </span>
          </div>

          {/* VIEW DETAILS */}

          <button
            type="button"
            onClick={() =>
              setSelectedProduct(product)
            }
          >
            View Details
          </button>

        </div>
      </div>
    );
  };

  // =========================================
  // MAIN UI
  // =========================================

  return (
    <div className="app">

      {/* =====================================
          FILTER LAYOUT FIX
      ===================================== */}

      <style>{`
        .filters {
          width: 90%;
          max-width: 1200px;
          margin: 30px auto;
          
          display: grid;
          grid-template-columns:
            minmax(0, 1.2fr)
            minmax(0, 1fr)
            minmax(0, 1fr)
            auto;

          align-items: center;
          gap: 12px;
        }

        .filters > * {
          min-width: 0;
        }

        .filters input {
          width: 100% !important;
          max-width: none !important;
        }

        .filters select {
          width: 100% !important;
        }

        .filters .category-container {
          width: 100%;
          min-width: 0;
        }

        .filters .sort-select {
          width: 100% !important;
        }

        .filters .favorites-button {
          width: auto;
          min-width: 120px;
          height: 45px;
          padding: 0 16px;

          border: 1px solid #d1d5db;
          border-radius: 8px;

          background: #ffffff;
          color: #111827;

          font-size: 14px;
          font-weight: 600;

          cursor: pointer;
          white-space: nowrap;

          transition: all 0.2s ease;
        }

        .filters .favorites-button:hover {
          background: #2563eb;
          border-color: #2563eb;
          color: #ffffff;
        }

        @media (max-width: 900px) {
          .filters {
            grid-template-columns:
              1fr 1fr;
          }

          .filters .favorites-button {
            width: 100%;
          }
        }

        @media (max-width: 600px) {
          .filters {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="header">

        <h1>
          Product Dashboard
        </h1>

        <p>
          Browse, search, and filter products
        </p>

        {/* BACK TO BROWSING */}

        {showFavorites && (
          <button
            type="button"
            onClick={backToBrowsing}
            style={{
              marginTop: "25px",
              padding: "10px 18px",

              borderRadius: "10px",
              border:
                "2px solid #007f73",

              background: "#f59e0b",
              color: "#ffffff",

              fontSize: "15px",
              fontWeight: "600",

              cursor: "pointer",

              boxShadow:
                "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            ← Back to Browsing
          </button>
        )}

      </header>

      {/* =====================================
          FILTERS
      ===================================== */}

      {!showFavorites && (
        <div className="filters">

          {/* SEARCH */}

          <SearchBar
            search={search}
            setSearch={handleSearch}
          />

          {/* CATEGORY */}

          <div className="category-container">

            <select
              value={selectedCategory}
              onChange={(e) =>
                handleCategoryChange(
                  e.target.value
                )
              }
              aria-label="Filter products by category"
            >
              <option value="">
                All Categories
              </option>

              {categories.map((category) => {
                const categoryValue =
                  typeof category === "string"
                    ? category
                    : category.slug ||
                      category.name;

                const categoryLabel =
                  typeof category === "string"
                    ? category
                    : category.name ||
                      category.slug;

                return (
                  <option
                    key={categoryValue}
                    value={categoryValue}
                  >
                    {categoryLabel}
                  </option>
                );
              })}

            </select>

          </div>

          {/* SORT */}

          <select
            className="sort-select"
            value={sort}
            onChange={(e) =>
              handleSortChange(
                e.target.value
              )
            }
          >
            <option value="default">
              Default
            </option>

            <option value="price-low">
              Price: Low to High
            </option>

            <option value="price-high">
              Price: High to Low
            </option>

            <option value="rating-high">
              Rating: High to Low
            </option>
          </select>

          {/* FAVORITES */}

          <button
            type="button"
            className="favorites-button"
            onClick={openFavorites}
          >
            ★ Favorites ({favorites.length})
          </button>

        </div>
      )}

      {/* =====================================
          FAVORITES TITLE
      ===================================== */}

      {showFavorites && (
        <div
          style={{
            width: "90%",
            maxWidth: "1200px",
            margin: "30px auto 0",
          }}
        >
          <h2
            style={{
              fontSize: "28px",
              marginBottom: "5px",
              color: "#111827",
            }}
          >
            My Favorites
          </h2>

          <p
            style={{
              color: "#6b7280",
              marginBottom: "10px",
            }}
          >
            {favorites.length === 0
              ? "You haven't added any favorites yet."
              : `${favorites.length} favorite ${
                  favorites.length === 1
                    ? "product"
                    : "products"
                }`}
          </p>
        </div>
      )}

      {/* ERROR */}

      {error && !showFavorites && (
        <div className="error">
          {error}
        </div>
      )}

      {/* LOADER */}

      {loading && !showFavorites && (
        <Loader />
      )}

      {/* PRODUCT GRID */}

      {!loading &&
        !error &&
        sortedProducts.length > 0 && (
          <div className="product-grid">

            {sortedProducts.map(
              (product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
            )}

          </div>
        )}

      {/* NO FAVORITES */}

      {showFavorites &&
        favorites.length === 0 && (
          <div
            style={{
              width: "90%",
              maxWidth: "1200px",
              margin: "30px auto",
              textAlign: "center",
              padding: "50px 20px",
              color: "#6b7280",
            }}
          >
            <div
              style={{
                fontSize: "45px",
                marginBottom: "10px",
              }}
            >
              ☆
            </div>

            <h3
              style={{
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              No Favorites Yet
            </h3>

            <p>
              Click the star on a product
              to add it to your favorites.
            </p>
          </div>
        )}

      {/* NO PRODUCTS */}

      {!loading &&
        !error &&
        !showFavorites &&
        sortedProducts.length === 0 && (
          <div className="no-products">
            No products found.
          </div>
        )}

      {/* PAGINATION */}

      {!loading &&
        !error &&
        !showFavorites &&
        totalPages > 1 && (

          <div className="pagination">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  page - 1
                )
              }
              disabled={page === 1}
            >
              Previous
            </button>

            {/* PAGE NUMBERS */}

            {getPageNumbers().map(
              (pageNumber, index) => {

                if (
                  pageNumber === "..."
                ) {
                  return (
                    <span
                      key={`dots-${index}`}
                    >
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    type="button"
                    key={pageNumber}
                    className={
                      page === pageNumber
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      handlePageChange(
                        pageNumber
                      )
                    }
                  >
                    {pageNumber}
                  </button>
                );
              }
            )}

            {/* NEXT */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  page + 1
                )
              }
              disabled={
                page === totalPages
              }
            >
              Next
            </button>

          </div>
        )}

      {/* PRODUCT MODAL */}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() =>
            setSelectedProduct(null)
          }
        />
      )}

    </div>
  );
}

export default App;