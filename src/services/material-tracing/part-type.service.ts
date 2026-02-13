import { fetchService } from "@/utils/fetchService";
import { TPartType } from "@/services/material-tracing/part-type.type";

const listPartTypes = async (options?: { isArchived?: boolean; search?: string }): Promise<Array<TPartType>> => {
  const url = new URL('/v1/part-types', 'http://localhost');

  if (options?.isArchived !== undefined) {
    url.searchParams.append('isArchived', String(options.isArchived));
  }

  if (options?.search) {
    url.searchParams.append('search', options.search);
  }

  const partTypesResponse = await fetchService(url.pathname + url.search);
  const partTypes = await partTypesResponse.json();

  return partTypes;
};
const getPartType = async (partTypeId: string): Promise<TPartType | null> => {
  const partTypeResponse = await fetchService(`/v1/part-types/${partTypeId}`);
  if (!partTypeResponse.ok) {
    return null;
  }

  const partType = await partTypeResponse.json();

  return partType;
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
