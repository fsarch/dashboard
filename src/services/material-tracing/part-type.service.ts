import { fetchService } from "@/utils/fetchService";
import { TPartType } from "@/services/material-tracing/part-type.type";
import type { TPaginationResult } from "./pagination.type";

const listPartTypes = async (options?: {
  skip?: number;
  take?: number;
  isArchived?: boolean;
  search?: string;
}): Promise<TPaginationResult<TPartType>> => {
  const url = new URL('/v1/part-types', 'http://localhost');

  if (options?.skip !== undefined) {
    url.searchParams.append('skip', options.skip.toString());
  }

  if (options?.take !== undefined) {
    url.searchParams.append('take', options.take.toString());
  }

  if (options?.isArchived !== undefined) {
    url.searchParams.append('isArchived', String(options.isArchived));
  }

  if (options?.search) {
    url.searchParams.append('search', options.search);
  }

  const partTypesResponse = await fetchService(url.pathname + url.search);
  return await partTypesResponse.json();
};
const getPartType = async (partTypeId: string): Promise<TPartType | null> => {
  const partTypeResponse = await fetchService(`/v1/part-types/${partTypeId}`);
  if (!partTypeResponse.ok) {
    return null;
  }

  return await partTypeResponse.json();
};

const deletePartType = async (partTypeId: string): Promise<void> => {
  const partTypeResponse = await fetchService(`/v1/part-types/${partTypeId}`, {
    method: 'DELETE',
  });
  if (!partTypeResponse.ok) {
    throw new Error('could not remove part-type')
  }
};

export const partTypeService = {
  listPartTypes,
  getPartType,
  deletePartType,
};
