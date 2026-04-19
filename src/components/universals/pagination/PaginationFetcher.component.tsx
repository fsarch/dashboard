"use client";

import React, { JSX, useCallback, useEffect, useState } from 'react';
import Pagination from "@/components/universals/pagination/Pagination.component";
import type { PaginationResultType } from "./PaginationFetcher.type";

type PaginationRequestType = {
  skip: number;
  take: number;
};

type PaginationFetcherComponentProps<T = unknown, TQuery extends object = Record<string, never>> = {
  className?: string;
  initialData: PaginationResultType<T>;
  getData: (options: PaginationRequestType & Partial<TQuery>) => Promise<PaginationResultType<T>>;
  query?: Partial<TQuery>;
  resetDependencies?: Array<unknown>;
  loadingText?: string;
  children: (data: PaginationResultType<T>) => JSX.Element;
};

const PaginationFetcherComponent = <T, TQuery extends object = Record<string, never>>({
  className,
  initialData,
  getData,
  query = {} as Partial<TQuery>,
  resetDependencies = [],
  loadingText = 'Loading...',
  children,
}: PaginationFetcherComponentProps<T, TQuery>) => {
  const [data, setData] = useState<PaginationResultType<T>>(initialData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('set data effect')
    setData(initialData);
  }, [initialData, ...resetDependencies]);

  const loadData = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);

    try {
      const loadedData = await getData({
        skip: (page - 1) * pageSize,
        take: pageSize,
        ...query,
      } as PaginationRequestType & Partial<TQuery>);

      setData(loadedData);
    } catch (error) {
      console.error('Failed to load paginated data:', error);
    } finally {
      setLoading(false);
    }
  }, [getData, query]);

  const handlePageChange = useCallback((page: number) => {
    void loadData(page, data.metadata.pageSize);
  }, [data.metadata.pageSize, loadData]);

  const handlePageSizeChange = useCallback((pageSize: number) => {
    void loadData(1, pageSize);
  }, [loadData]);

  const hasNextPage = data.metadata.currentPage < data.metadata.totalPages;

  if (loading) {
    return (
      <div className={className} style={{ padding: '2rem', textAlign: 'center' }}>
        {loadingText}
      </div>
    );
  }

  return (
    <div className={className}>
      {children(data)}
      <Pagination
        currentPage={data.metadata.currentPage}
        pageSize={data.metadata.pageSize}
        totalItems={data.metadata.totalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export default PaginationFetcherComponent;
