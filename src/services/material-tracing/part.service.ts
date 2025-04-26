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
  const partsResponse = await fetchService(`/v1/short-codes/${code}/materials`);
  const parts = await partsResponse.json();

  return parts;
};

export const partService = {
  listParts,
  getPart,
  listShortCodes,
  listPartsByShortCode
};
