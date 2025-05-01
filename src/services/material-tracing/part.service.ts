import { fetchService } from "@/utils/fetchService";
import { TPart } from "@/services/material-tracing/part.type";
import { TShortCode } from "@/services/material-tracing/short-code.type";
import { TMaterial } from "@/services/material-tracing/material.type";

const listParts = async (): Promise<Array<TPart>> => {
  const partsResponse = await fetchService('/v1/parts');
  const parts = await partsResponse.json();

  return parts;
};

const getPart = async (partId: string): Promise<TPart | null> => {
  const partResponse = await fetchService(`/v1/parts/${partId}`);
  if (!partResponse.ok) {
    return null;
  }

  const part = await partResponse.json();

  return part;
};

const listShortCodes = async (partId: string): Promise<Array<TShortCode>> => {
  const partShortCodesResponse = await fetchService(`/v1/parts/${partId}/short-codes`);
  const partShortCodes = await partShortCodesResponse.json();

  return partShortCodes;
};

const listPartsByShortCode = async (code: string): Promise<Array<TMaterial>> => {
  const partsResponse = await fetchService(`/v1/short-codes/${code}/parts`);
  const parts = await partsResponse.json();

  return parts;
};

const getOrCreateMaterial = async (partId: string, materialId: string): Promise<void> => {
  const partMaterialResponse = await fetchService(`/v1/parts/${partId}/materials/${materialId}`, {
    method: 'PUT',
  });
  await partMaterialResponse.json();
};

const listMaterials = async (partId: string): Promise<Array<TMaterial>> => {
  const materialsResponse = await fetchService(`/v1/parts/${partId}/materials`);
  const materials = await materialsResponse.json();

  return materials;
};

const getOrCreatePartPart = async (partId: string, childPartId: string, amount: number): Promise<void> => {
  const partPartResponse = await fetchService(`/v1/parts/${partId}/parts/${childPartId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
    }),
  });
  await partPartResponse.json();
};

const listPartParts = async (partId: string): Promise<Array<TPart>> => {
  const partsResponse = await fetchService(`/v1/parts/${partId}/parts`);
  const parts = await partsResponse.json();

  return parts;
};

export const partService = {
  listParts,
  getPart,
  listShortCodes,
  listPartsByShortCode,
  getOrCreateMaterial,
  listMaterials,
  getOrCreatePartPart,
  listPartParts,
};
