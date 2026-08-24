# Product Listing Dashboard

A React product listing dashboard built using the DummyJSON REST API.

## Features

- Product listing from REST API
- Async/await API handling
- Loading state
- Error handling
- Retry button
- Search products
- Category filtering
- API-based pagination
- Product details modal
- Image fallback handling
- Empty state
- Responsive design

## Technologies Used

- React
- JavaScript
- CSS
- Vite
- REST API
- DummyJSON API

## API

This project uses the DummyJSON Products API:

https://dummyjson.com/products

## API Handling Approach

API-related logic is separated into:

`src/services/productService.js`

The application uses async/await and the Fetch API to communicate with the REST API.

The application handles:

- Loading
- Success
- Error
- Empty results
- Retry

## State Management

React `useState` is used to manage:

- Products
- Loading state
- Error state
- Search term
- Selected category
- Current page
- Total products
- Selected product

React `useEffect` is used to fetch data when the page, search term, or category changes.

## Component Structure

```text
src/
├── components/
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── Searchbar.jsx
│   ├── CategoryFilter.jsx
│   ├── Pagination.jsx
│   ├── ProductModal.jsx
│   └── Loader.jsx
│
├── services/
│   └── productService.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx