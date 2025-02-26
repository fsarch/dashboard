import { fetchService } from "@/utils/fetchService";
import { TMaterial } from "@/services/material-tracing/material.type";

const listMaterials = async (): Promise<Array<TMaterial>> => {
  const materialsResponse = await fetchService('/v1/materials');
  const materials = await materialsResponse.json();

  return materials;
};

const getMaterial = async (materialId: string): Promise<TMaterial> => {
  const materialResponse = await fetchService(`/v1/materials/${materialId}`);
  const material = await materialResponse.json();

  return material;
};

export const materialService = {
  listMaterials,
  getMaterial,
};
