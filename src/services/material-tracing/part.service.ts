import { fetchService } from "@/utils/fetchService";
import { TPart } from "@/services/material-tracing/part.type";
import { TShortCode } from "@/services/material-tracing/short-code.type";
import { TMaterial } from "@/services/material-tracing/material.type";

const listParts = async (options?: { skip?: number; take?: number; isArchived?: boolean; search?: string }): Promise<Array<TPart>> => {
  const url = new URL('/v1/parts', 'http://localhost'); // Base URL will be replaced by fetchService

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

  const partsResponse = await fetchService(url.pathname + url.search);
  const parts = await partsResponse.json();

  return parts;
};

const getPart = async (partId: string): Promise<TPart | null> => {
  const partResponse = await fetchService(`/v1/parts/${partId}?include=availableAmount`);
  if (!partResponse.ok) {
    return null;
  }

  const part = await partResponse.json();

  return part;
};

const deletePart = async (partId: string): Promise<void> => {
  const partResponse = await fetchService(`/v1/parts/${partId}`, {
    method: 'DELETE',
  });
  if (!partResponse.ok) {
    throw new Error('could not delete part');
  }
};

const listShortCodes = async (partId: string): Promise<Array<TShortCode>> => {
  const partShortCodesResponse = await fetchService(`/v1/parts/${partId}/short-codes`);
  const partShortCodes = await partShortCodesResponse.json();

  return partShortCodes;
};

const listPartsByShortCode = async (code: string): Promise<Array<TPart>> => {
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

const deletePartMaterial = async (partId: string, materialId: string): Promise<void> => {
  const partMaterialResponse = await fetchService(`/v1/parts/${partId}/materials/${materialId}`, {
    method: 'DELETE',
  });
  if (!partMaterialResponse.ok) {
    throw new Error('could not delete part material');
  }
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

const deletePartPart = async (partId: string, childPartId: string): Promise<void> => {
  const partPartResponse = await fetchService(`/v1/parts/${partId}/parts/${childPartId}`, {
    method: 'DELETE',
  });
  if (!partPartResponse.ok) {
    throw new Error('could not delete part part');
  }
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
  deletePartMaterial,
  listMaterials,
  getOrCreatePartPart,
  listPartParts,
  deletePart,
  deletePartPart,
};
