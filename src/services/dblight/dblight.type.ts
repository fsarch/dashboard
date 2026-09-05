// Collections

export type TCreateCollectionDto = {
  name: string;
  schema: Record<string, unknown>;
  metadata?: Record<string, unknown>;
};

export type TCollectionDto = {
  id: string;
  name: string;
  currentSchemaVersionId: string;
  currentSchemaVersion: number;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

// Schema versions

export type TSchemaVersionDto = {
  id: string;
  collectionId: string;
  version: number;
  schema: Record<string, unknown>;
  createdAt: string;
};

// Records

export type TRecordDto = {
  id: string;
  collectionId: string;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type TRecordPageDto = {
  data: Array<TRecordDto>;
  nextCursor?: string;
};

export type TListRecordsParams = {
  limit?: number;
  cursor?: string;
};

// Structured error body shape returned by dblight-server's
// AllExceptionsFilter - see dblight-server's
// src/common/exceptions/db-api.exception.ts.
export type TDbApiErrorBody = {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
};
