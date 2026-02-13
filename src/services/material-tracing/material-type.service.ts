import { fetchService } from "@/utils/fetchService";
import { TMaterialType } from "@/services/material-tracing/material-type.type";

const listMaterialTypes = async (options?: { isArchived?: boolean; search?: string }): Promise<Array<TMaterialType>> => {
  const url = new URL('/v1/material-types', 'http://localhost');

  if (options?.isArchived !== undefined) {
    url.searchParams.append('isArchived', String(options.isArchived));
  }

  if (options?.search) {
    url.searchParams.append('search', options.search);
  }

  const materialTypesResponse = await fetchService(url.pathname + url.search);
  const materialTypes = await materialTypesResponse.json();

  return materialTypes;
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
