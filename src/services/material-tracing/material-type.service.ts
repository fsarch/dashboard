import { fetchService } from "@/utils/fetchService";
import { TMaterialType } from "@/services/material-tracing/material-type.type";

const listMaterialTypes = async (): Promise<Array<TMaterialType>> => {
  const manufacturersResponse = await fetchService('/v1/material-types');
  const manufacturers = await manufacturersResponse.json();

  return manufacturers;
};

export const materialTypeService = {
  listMaterialTypes,
};
