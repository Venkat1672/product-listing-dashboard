const BASE_URL = "https://dummyjson.com/products";
// Fetch products with search, category and pagination
export async function getProducts({
  page = 1,
  limit = 12,
  search = "",
  category = "",
}) {
  let endpoint = BASE_URL;

  // Search products
  if (search.trim()) {
    endpoint = `${BASE_URL}/search?q=${encodeURIComponent(search.trim())}`;
  }
  // Get products by category
  else if (category) {
    endpoint = `${BASE_URL}/category/${encodeURIComponent(category)}`;
  }

  const skip = (page - 1) * limit;

  const separator = endpoint.includes("?") ? "&" : "?";

  const response = await fetch(
    `${endpoint}${separator}limit=${limit}&skip=${skip}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await response.json();

  return data;
}

// Fetch all product categories
export async function getCategories() {
  const response = await fetch(`${BASE_URL}/category-list`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();

  return data;
}