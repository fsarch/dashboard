'use client';

import React, { useState, useCallback } from 'react';
import List from "@/components/universals/list/List";
import { TPart } from "@/services/material-tracing/part.type";
import Pagination from "@/components/universals/pagination/Pagination.component";
import styles from './PartsList.module.scss';
import LinkListItem from "@/components/universals/list/LinkListItem";

type PartWithUrl = TPart & {
  url: string;
};

type PartsListProps = {
  className?: string;
  initialParts: PartWithUrl[];
  fetchParts: (options: { skip: number, take: number, search?: string }) => Promise<PartWithUrl[]>;
  search?: string;
};

const PartsList: React.FunctionComponent<PartsListProps> = ({ initialParts, fetchParts, className, search }) => {
  const [parts, setParts] = useState<PartWithUrl[]>(initialParts);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);

  const loadParts = useCallback(async (page: number, size: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * size;
      const take = size + 1; // Request one extra to determine if there's a next page

      const loadedParts = await fetchParts({ skip, take, search });

      // Check if there are more pages
      const hasMore = loadedParts.length > size;
      setHasNextPage(hasMore);

      // Remove the extra item if present
      const partsToShow = hasMore ? loadedParts.slice(0, size) : loadedParts;

      setParts(partsToShow);
    } catch (error) {
      console.error('Failed to load parts:', error);
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchParts, search]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadParts(page, pageSize);
  }, [pageSize, loadParts]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    loadParts(1, size);
  }, [loadParts]);

  // Check if we have more than pageSize items to determine hasNextPage
  React.useEffect(() => {
    setHasNextPage(initialParts.length >= pageSize);
  }, [initialParts.length, pageSize]);

  if (loading) {
    return (
      <div className={className} style={{ padding: '2rem', textAlign: 'center' }}>
        Loading parts...
      </div>
    );
  }

  return (
    <div className={className}>
      <List className={styles.list}>
        {parts.map((part) => (
          <LinkListItem key={part.id} href={part.url}>
            {part.name}
          </LinkListItem>
        ))}
      </List>

      <Pagination
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default PartsList;
