const BASE_URL = "https://dummyjson.com/products";

// =====================================
// GET PRODUCTS
// =====================================

export const getProducts = async ({
  page = 1,
  limit = 4,
  search = "",
  category = "",
}) => {

  // Calculate how many products to skip
  //
  // Page 1:
  // (1 - 1) * 4 = 0
  //
  // Page 2:
  // (2 - 1) * 4 = 4
  //
  // Page 3:
  // (3 - 1) * 4 = 8

  const skip = (page - 1) * limit;

  let url;


  // =====================================
  // CATEGORY
  // =====================================

  if (category !== "") {

    url =
      `${BASE_URL}/category/` +
      `${encodeURIComponent(category)}` +
      `?limit=${limit}` +
      `&skip=${skip}`;

  }


  // =====================================
  // SEARCH
  // =====================================

  else if (search.trim() !== "") {

    url =
      `${BASE_URL}/search` +
      `?q=${encodeURIComponent(search.trim())}` +
      `&limit=${limit}` +
      `&skip=${skip}`;

  }


  // =====================================
  // ALL PRODUCTS
  // =====================================

  else {

    url =
      `${BASE_URL}` +
      `?limit=${limit}` +
      `&skip=${skip}`;

  }


  // Check the URL in browser console
  console.log("Fetching:", url);


  // =====================================
  // API REQUEST
  // =====================================

  const response = await fetch(url);


  // Check for API error
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }


  // Convert response to JSON
  const data = await response.json();


  // Return products data
  return data;
};


// =====================================
// GET CATEGORIES
// =====================================

export const getCategories = async () => {

  const response = await fetch(
    `${BASE_URL}/category-list`
  );


  // Check for API error
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }


  // Convert response to JSON
  const data = await response.json();


  // Return category list
  return data;
};