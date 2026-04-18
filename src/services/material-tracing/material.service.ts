import { fetchService } from "@/utils/fetchService";
import { TMaterial } from "@/services/material-tracing/material.type";
import { TShortCode } from "@/services/material-tracing/short-code.type";
import { TPaginationResult } from "@/services/material-tracing/pagination.type";

const listMaterials = async (options?: {
  skip?: number;
  take?: number;
  isArchived?: boolean;
  search?: string;
}): Promise<TPaginationResult<TMaterial>> => {
  const url = new URL('/v1/materials', 'http://localhost');

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

  const materialsResponse = await fetchService(url.pathname + url.search);
  return await materialsResponse.json();
};

const listShortCodes = async (materialId: string): Promise<Array<TShortCode>> => {
  const materialShortCodesResponse = await fetchService(`/v1/materials/${materialId}/short-codes`);
  const materialShortCodes = await materialShortCodesResponse.json();

  return materialShortCodes;
};

const getMaterial = async (materialId: string): Promise<TMaterial> => {
  const materialResponse = await fetchService(`/v1/materials/${materialId}`);
  const material = await materialResponse.json();

  return material;
};

const listMaterialsByShortCode = async (code: string): Promise<Array<TMaterial>> => {
  const materialsResponse = await fetchService(`/v1/short-codes/${code}/materials`);
  const materials = await materialsResponse.json();

  return materials;
};

const deleteMaterial = async (materialId: string): Promise<void> => {
  const materialResponse = await fetchService(`/v1/materials/${materialId}`, {
    method: 'DELETE',
  });
  if (!materialResponse) {
    throw new Error('could not remove material');
  }
};

export const materialService = {
  listMaterials,
  getMaterial,
  listShortCodes,
  listMaterialsByShortCode,
  deleteMaterial,
};
