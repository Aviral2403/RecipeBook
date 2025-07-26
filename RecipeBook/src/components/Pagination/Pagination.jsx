import React from 'react';
import './Pagination.css';

const Pagination = ({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  loading
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);

      // Calculate start and end for middle pages
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        end = Math.min(4, totalPages - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        start = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (page !== currentPage && page !== '...' && !loading) {
      onPageChange(page);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1 && !loading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages && !loading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Showing page {currentPage} of {totalPages} 
          ({totalResults.toLocaleString()} total recipes)
        </span>
      </div>

      <div className="pagination-controls">
        <button 
          className={`pagination-btn ${currentPage === 1 ? 'disabled' : ''}`}
          onClick={handlePrevious}
          disabled={currentPage === 1 || loading}
        >
          ← Previous
        </button>

        <div className="page-numbers">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`page-btn ${
                page === currentPage ? 'active' : ''
              } ${page === '...' ? 'ellipsis' : ''} ${loading ? 'disabled' : ''}`}
              onClick={() => handlePageClick(page)}
              disabled={page === '...' || loading}
            >
              {page}
            </button>
          ))}
        </div>

        <button 
          className={`pagination-btn ${currentPage === totalPages ? 'disabled' : ''}`}
          onClick={handleNext}
          disabled={currentPage === totalPages || loading}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;