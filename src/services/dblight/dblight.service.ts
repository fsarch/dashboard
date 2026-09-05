import { fetchService } from '@/utils/fetchService';
import {
  TCollectionDto,
  TCreateCollectionDto,
  TDbApiErrorBody,
  TListRecordsParams,
  TRecordDto,
  TRecordPageDto,
  TSchemaVersionDto,
} from './dblight.type';

/**
 * dblight-server responds with a structured `{ statusCode, code, message,
 * details? }` body for every error (see its `AllExceptionsFilter`) - surface
 * that `message` instead of a generic "request failed" so e.g. schema
 * validation/compatibility errors are readable in the UI.
 */
async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  const body = text.length > 0 ? JSON.parse(text) : undefined;

  if (!response.ok) {
    const errorBody = body as TDbApiErrorBody | undefined;
    throw new Error(errorBody?.message ?? `request failed with status ${response.status}`);
  }

  return body as T;
}

// Collections

const listCollections = async (serviceId: string): Promise<Array<TCollectionDto>> => {
  const response = await fetchService('/collections', undefined, { serviceId });
  return parseResponse(response);
};

const getCollection = async (collectionId: string, serviceId: string): Promise<TCollectionDto> => {
  const response = await fetchService(`/collections/${collectionId}`, undefined, { serviceId });
  return parseResponse(response);
};

const createCollection = async (
  dto: TCreateCollectionDto,
  serviceId: string,
): Promise<TCollectionDto> => {
  const response = await fetchService(
    '/collections',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    },
    { serviceId },
  );
  return parseResponse(response);
};

const deleteCollection = async (collectionId: string, serviceId: string): Promise<void> => {
  const response = await fetchService(
    `/collections/${collectionId}`,
    { method: 'DELETE' },
    { serviceId },
  );
  await parseResponse(response);
};

// Schema versions

const listSchemaVersions = async (
  collectionId: string,
  serviceId: string,
): Promise<Array<TSchemaVersionDto>> => {
  const response = await fetchService(
    `/collections/${collectionId}/schema-versions`,
    undefined,
    { serviceId },
  );
  return parseResponse(response);
};

const createSchemaVersion = async (
  collectionId: string,
  schema: Record<string, unknown>,
  serviceId: string,
): Promise<TSchemaVersionDto> => {
  const response = await fetchService(
    `/collections/${collectionId}/schema-versions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schema }),
    },
    { serviceId },
  );
  return parseResponse(response);
};

// Records

const listRecords = async (
  collectionId: string,
  params: TListRecordsParams,
  serviceId: string,
): Promise<TRecordPageDto> => {
  const searchParams = new URLSearchParams();
  if (params.limit) {
    searchParams.set('limit', String(params.limit));
  }
  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }

  const query = searchParams.toString();
  const response = await fetchService(
    `/collections/${collectionId}/records${query ? `?${query}` : ''}`,
    undefined,
    { serviceId },
  );
  return parseResponse(response);
};

const getRecord = async (
  collectionId: string,
  recordId: string,
  serviceId: string,
): Promise<TRecordDto> => {
  const response = await fetchService(
    `/collections/${collectionId}/records/${recordId}`,
    undefined,
    { serviceId },
  );
  return parseResponse(response);
};

const createRecord = async (
  collectionId: string,
  data: Record<string, unknown>,
  serviceId: string,
): Promise<TRecordDto> => {
  const response = await fetchService(
    `/collections/${collectionId}/records`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    },
    { serviceId },
  );
  return parseResponse(response);
};

const replaceRecord = async (
  collectionId: string,
  recordId: string,
  data: Record<string, unknown>,
  serviceId: string,
): Promise<TRecordDto> => {
  const response = await fetchService(
    `/collections/${collectionId}/records/${recordId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    },
    { serviceId },
  );
  return parseResponse(response);
};

const deleteRecord = async (
  collectionId: string,
  recordId: string,
  serviceId: string,
): Promise<void> => {
  const response = await fetchService(
    `/collections/${collectionId}/records/${recordId}`,
    { method: 'DELETE' },
    { serviceId },
  );
  await parseResponse(response);
};

export const dblightService = {
  listCollections,
  getCollection,
  createCollection,
  deleteCollection,
  listSchemaVersions,
  createSchemaVersion,
  listRecords,
  getRecord,
  createRecord,
  replaceRecord,
  deleteRecord,
};
