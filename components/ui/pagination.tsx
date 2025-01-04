import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 7; // Show up to 7 page numbers
    
    let startPage = Math.max(1, currentPage - 3);
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`
            w-8 h-8 mx-0.5 rounded-md text-sm font-medium
            ${i === currentPage 
              ? 'bg-green-100 text-green-700 border-0' 
              : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }
          `}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if needed
    if (startPage > 1) {
      pages.unshift(
        <span key="start-ellipsis" className="px-2 text-gray-500">...</span>
      );
      pages.unshift(
        <button
          key={1}
          onClick={() => onPageChange(1)}
          className="w-8 h-8 mx-0.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"
        >
          1
        </button>
      );
    }
    
    if (endPage < totalPages) {
      pages.push(
        <span key="end-ellipsis" className="px-2 text-gray-500">...</span>
      );
      pages.push(
        <button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className="w-8 h-8 mx-0.5 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 border border-gray-200"
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 sm:px-6 w-[50%] mx-auto">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || totalPages === 0}
        className={`
          relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
          ${currentPage === 1 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        Previous
      </button>
      
      <div className="flex items-center justify-center flex-1">
        {renderPageNumbers()}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className={`
          relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
          ${currentPage === totalPages 
            ? 'text-gray-300 cursor-not-allowed' 
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }
        `}
      >
        Next
      </button>
    </div>
  );
};


export {Pagination}