function ProductCard({ product, onViewDetails }) {
  const handleImageError = (event) => {
    event.target.style.display = "none";
    event.target.parentElement.classList.add("image-error");
    event.target.parentElement.innerHTML = "Image unavailable";
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={product.thumbnail || product.images?.[0]}
          alt={product.title}
          onError={handleImageError}
        />
      </div>

      <div className="product-content">
        <span className="product-category">
          {product.category}
        </span>

        <h2>{product.title}</h2>

        <p className="product-description">
          {product.description}
        </p>

        <div className="product-info">
          <strong>${product.price}</strong>
          <span>⭐ {product.rating}</span>
        </div>

        <button
          className="details-button"
          onClick={() => onViewDetails(product)}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default ProductCard;