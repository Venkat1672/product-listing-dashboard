function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <div className="pagination">

      {/* Previous Button */}
      <button
        type="button"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>


      {/* Page 1 */}
      <button
        type="button"
        className={
          currentPage === 1
            ? "active"
            : ""
        }
        onClick={() => handlePageClick(1)}
      >
        1
      </button>


      {/* Page 2 */}
      {totalPages >= 2 && (
        <button
          type="button"
          className={
            currentPage === 2
              ? "active"
              : ""
          }
          onClick={() => handlePageClick(2)}
        >
          2
        </button>
      )}


      {/* Page 3 */}
      {totalPages >= 3 && (
        <button
          type="button"
          className={
            currentPage === 3
              ? "active"
              : ""
          }
          onClick={() => handlePageClick(3)}
        >
          3
        </button>
      )}


      {/* Dots */}
      {totalPages > 3 && (
        <span className="pagination-dots">
          ...
        </span>
      )}


      {/* Next Button */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;