import { fetchService } from "@/utils/fetchService";
import { TMaterialType } from "@/services/material-tracing/material-type.type";
import { TPaginationResult } from "@/services/material-tracing/pagination.type";

const listMaterialTypes = async (options?: {
  skip?: number;
  take?: number;
  isArchived?: boolean;
  search?: string;
}): Promise<TPaginationResult<TMaterialType>> => {
  const url = new URL('/v1/material-types', 'http://localhost');

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

  const materialTypesResponse = await fetchService(url.pathname + url.search);
  return await materialTypesResponse.json();
};
const getMaterialType = async (materialTypeId: string): Promise<TMaterialType> => {
  const materialTypeRespose = await fetchService(`/v1/material-types/${materialTypeId}`);
  const materialType = await materialTypeRespose.json();

  return materialType;
};
const deleteMaterialType = async (materialTypeId: string): Promise<void> => {
  const materialTypeRespose = await fetchService(`/v1/material-types/${materialTypeId}`, {
    method: 'DELETE',
  });

  if (!materialTypeRespose.ok) {
    throw new Error('could not delete materialType');
  }
};

export const materialTypeService = {
  listMaterialTypes,
  getMaterialType,
  deleteMaterialType,
};
