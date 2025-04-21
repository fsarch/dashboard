import { fetchService } from "@/utils/fetchService";
import { TPartType } from "@/services/material-tracing/part-type.type";

const listPartTypes = async (): Promise<Array<TPartType>> => {
  const partTypesResponse = await fetchService('/v1/part-types');
  const partTypes = await partTypesResponse.json();

  return partTypes;
};
const getPartType = async (partTypeId: string): Promise<TPartType | null> => {
  const partTypeResponse = await fetchService(`/v1/part-types/${partTypeId}`);
  if (!partTypeResponse.ok) {
    return null;
  }

  const partType = await partTypeResponse.json();

  return partType;
};

export const partTypeService = {
  listPartTypes,
  getPartType,
};
