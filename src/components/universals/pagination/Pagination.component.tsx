'use client';

import React from 'react';
import styles from './Pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  pageSize: number;
  totalItems?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  hasNextPage?: boolean;
};

const Pagination: React.FunctionComponent<PaginationProps> = ({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  hasNextPage,
}) => {
  const pageSizeOptions = [10, 25, 50, 100];

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = currentPage * pageSize;

  return (
    <div className={styles.pagination}>
      <div className={styles.pageSize}>
        <label htmlFor="pageSize">Items per page:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={styles.select}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.info}>
        {totalItems !== undefined ? (
          <span>
            Showing {startItem}-{Math.min(endItem, totalItems)} of {totalItems} items
          </span>
        ) : (
          <span>
            Showing {startItem}-{endItem}
            {hasNextPage && '+'}
          </span>
        )}
      </div>

      <div className={styles.navigation}>
        <button
          onClick={handlePrevious}
          disabled={currentPage <= 1}
          className={styles.button}
        >
          Previous
        </button>
        
        <span className={styles.pageNumber}>
          Page {currentPage}
        </span>
        
        <button
          onClick={handleNext}
          disabled={!hasNextPage}
          className={styles.button}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;