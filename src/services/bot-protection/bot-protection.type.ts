// Claim DTOs
export type TClaimDto = {
  id: string;
  externalId: string | null;
  difficulty: number;
  duration: number | null;
  creationTime: string;
  deletionTime: string | null;
};

// Create Claim DTO
export type TCreateClaimDto = {
  // Empty based on OpenAPI spec
};

// Approve Claim DTO
export type TApproveClaimDto = {
  // Empty based on OpenAPI spec
};

// Pagination DTOs
export type TPaginationResultMetaDto = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type TPaginationResultDto<T> = {
  data: T[];
  metadata: TPaginationResultMetaDto;
};

// Pagination query params
export type TPaginationParams = {
  page: number;
  pageSize: number;
};
