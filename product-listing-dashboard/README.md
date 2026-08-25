# Product Listing Dashboard

A React-based Product Listing Dashboard built using the DummyJSON REST API.

The application allows users to browse products, search products, filter products by category, navigate through pages, and view detailed product information.

## Features

- Product listing
- Product search
- Category filtering
- Pagination
- Product details modal
- Loading state
- Error handling
- Empty state
- Retry functionality
- Responsive UI
- API integration using DummyJSON

## Technologies Used

- React
- JavaScript
- CSS
- Vite
- REST API
- DummyJSON API
- Git
- GitHub

## API

This project uses the DummyJSON REST API.

API:

https://dummyjson.com/products

## Project Structure

```text
src/
├── components/
│   ├── CategoryFilter.jsx
│   ├── Loader.jsx
│   ├── Pagination.jsx
│   ├── ProductCard.jsx
│   ├── ProductGrid.jsx
│   ├── ProductModal.jsx
│   └── Searchbar.jsx
│
├── services/
│   └── productService.js
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx