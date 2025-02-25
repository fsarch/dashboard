import { fetchService } from "@/utils/fetchService";
import { TMaterial } from "@/services/material-tracing/material.type";

const listMaterials = async (): Promise<Array<TMaterial>> => {
  const materialsResponse = await fetchService('/v1/materials');
  const materials = await materialsResponse.json();

  return materials;
};

export const materialService = {
  listMaterials,
};
