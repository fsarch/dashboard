'use client';

import React, { useState, useCallback } from 'react';
import List from "@/components/universals/list/List";
import { TPart } from "@/services/material-tracing/part.type";
import Pagination from "@/components/universals/pagination/Pagination.component";
import styles from './PartsList.module.scss';
import LinkListItem from "@/components/universals/list/LinkListItem";
import { TPaginationResult } from "@/services/material-tracing/pagination.type";

type PartWithUrl = TPart & {
  url: string;
};

type PartsListProps = {
  className?: string;
  initialParts: PartWithUrl[];
  initialTotalItems: number;
  fetchParts: (options: {
    skip: number;
    take: number;
    search?: string;
    partTypeId?: string;
  }) => Promise<TPaginationResult<PartWithUrl>>;
  search?: string;
  partTypeId?: string;
};

const PartsList: React.FunctionComponent<PartsListProps> = ({
  initialParts,
  initialTotalItems,
  fetchParts,
  className,
  search,
  partTypeId,
}) => {
  const [parts, setParts] = useState<PartWithUrl[]>(initialParts);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  const loadParts = useCallback(async (page: number, size: number) => {
    setLoading(true);
    try {
      const skip = (page - 1) * size;
      const options = { skip, take: size, ...(search && { search }), ...(partTypeId && { partTypeId }) };
      const loadedPartsResult = await fetchParts(options);

      setParts(loadedPartsResult.data);
      setTotalItems(loadedPartsResult.metadata.totalItems);
    } catch (error) {
      console.error('Failed to load parts:', error);
      setParts([]);
    } finally {
      setLoading(false);
    }
  }, [fetchParts, search, partTypeId]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    loadParts(page, pageSize);
  }, [pageSize, loadParts]);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    loadParts(1, size);
  }, [loadParts]);

  const hasNextPage = currentPage * pageSize < totalItems;

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
        totalItems={totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default PartsList;
