function ProductModal({ product, onClose }) {
  if (!product) {
    return null;
  }

  const handleImageError = (event) => {
    event.target.style.display = "none";
    event.target.parentElement.classList.add("image-error");
    event.target.parentElement.innerHTML = "Image unavailable";
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(event) => event.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="modal-image-container">
          <img
            src={product.images?.[0] || product.thumbnail}
            alt={product.title}
            onError={handleImageError}
          />
        </div>

        <div className="modal-content">
          <span className="product-category">
            {product.category}
          </span>

          <h2>{product.title}</h2>

          <p>{product.description}</p>

          <div className="details-list">
            <p>
              <strong>Price:</strong> ${product.price}
            </p>

            <p>
              <strong>Discount:</strong>{" "}
              {product.discountPercentage}%
            </p>

            <p>
              <strong>Rating:</strong> ⭐ {product.rating}
            </p>

            <p>
              <strong>Stock:</strong> {product.stock}
            </p>

            <p>
              <strong>Category:</strong> {product.category}
            </p>

            <p>
              <strong>Brand:</strong> {product.brand || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;