'use client';

import React from 'react';
import Button from '@/components/universals/forms/Button';
import styles from './Pagination.module.scss';
import selectStyles from '@/components/universals/forms/Select.module.scss';

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
  const totalPages = totalItems !== undefined
    ? Math.max(1, Math.ceil(totalItems / pageSize))
    : Math.max(currentPage + (hasNextPage ? 1 : 0), 1);
  const pageOptions = Array.from({ length: totalPages }, (_, index) => index + 1);

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

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0 ? 0 : currentPage * pageSize;

  return (
    <div className={styles.pagination}>
      <div className={styles.pageSize}>
        <label htmlFor="pageSize">Einträge pro Seite:</label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className={selectStyles.input}
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
            Zeige {startItem}-{Math.min(endItem, totalItems)} von {totalItems} Einträgen
          </span>
        ) : (
          <span>
            Zeige Einträge {startItem}-{endItem}
            {hasNextPage && '+'}
          </span>
        )}
      </div>

      <div className={styles.navigation}>
        <Button
          type="button"
          onClick={handlePrevious}
          disabled={currentPage <= 1}
        >
          Zurück
        </Button>

        <div className={styles.pageSelector}>
          <label htmlFor="pageNumber">Seite:</label>
          <select
            id="pageNumber"
            value={currentPage}
            onChange={(e) => onPageChange(Number(e.target.value))}
            className={selectStyles.input}
          >
            {pageOptions.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>
          {totalItems !== undefined && (
            <span className={styles.pageNumber}>von {totalPages}</span>
          )}
        </div>

        <Button
          type="button"
          onClick={handleNext}
          disabled={!hasNextPage}
        >
          Weiter
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
