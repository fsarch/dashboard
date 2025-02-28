import { fetchService } from "@/utils/fetchService";
import { TMaterial } from "@/services/material-tracing/material.type";
import { TShortCode } from "@/services/material-tracing/short-code.type";

const listMaterials = async (): Promise<Array<TMaterial>> => {
  const materialsResponse = await fetchService('/v1/materials');
  const materials = await materialsResponse.json();

  return materials;
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

export const materialService = {
  listMaterials,
  getMaterial,
  listShortCodes,
  listMaterialsByShortCode,
};
