export type PaginationMetadataType = {
  currentPage: number;
  totalItems: number;
  totalPages: number;
  pageSize: number;
};

export type PaginationResultType<T> = {
  items: Array<T>;
  metadata: PaginationMetadataType;
};

export type PaginationRequestType = {
  skip: number;
  take: number;
};
