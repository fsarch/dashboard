import { fetchService } from "@/utils/fetchService";
import { TPart } from "@/services/material-tracing/part.type";

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

export const partService = {
  listParts,
  getPart,
};
