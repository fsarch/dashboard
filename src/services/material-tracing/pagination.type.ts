export type TPaginationMetadata = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginationResult<T> = {
  data: Array<T>;
  metadata: TPaginationMetadata;
};
