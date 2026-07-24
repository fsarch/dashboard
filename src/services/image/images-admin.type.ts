export type TagDefinitionDto = {
  id: string;
  key: string;
  description?: string;
  creationTime: string;
};

export type ImageDto = {
  id: string;
  width: number;
  height: number;
  fileSize: number;
  mimeType: string;
  md5: string;
  hasAlpha: boolean;
  hasAnimation: boolean;
  creationTime: string;
  deletionTime?: string;
  isPublic: boolean;
  externalId?: string;
  tags?: string[];
  slugs?: Array<{
    slug: string;
  }>;
};

export type PaginationResultMetaDto = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

export type PaginationResultDto<T> = {
  data: T[];
  metadata: PaginationResultMetaDto;
};

export type ListImagesOptions = {
  embed?: string[];
  isPublic?: boolean;
  tag?: string[];
  page?: number;
  limit?: number;
};
