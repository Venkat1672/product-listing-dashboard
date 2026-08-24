import ProductCard from "./ProductCard";

function ProductGrid({ products, onViewDetails }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}

export default ProductGrid;