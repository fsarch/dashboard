import { fetchService } from "@/utils/fetchService";
import { TPartType } from "@/services/material-tracing/part-type.type";

const listPartTypes = async (): Promise<Array<TPartType>> => {
  const partTypesResponse = await fetchService('/v1/part-types');
  const partTypes = await partTypesResponse.json();

  return partTypes;
};
const getPartType = async (partTypeId: string): Promise<TPartType> => {
  const partTypeResponse = await fetchService(`/v1/part-types/${partTypeId}`);
  const partType = await partTypeResponse.json();

  return partType;
};

export const partTypeService = {
  listPartTypes,
  getPartType,
};
