import { fetchService } from "@/utils/fetchService";
import { TManufacturer } from "@/services/material-tracing/manufacturer.type";

const listManufacturers = async (): Promise<Array<TManufacturer>> => {
  const manufacturersResponse = await fetchService('/v1/manufacturers');
  const manufacturers = await manufacturersResponse.json();

  return manufacturers;
};

export const manufacturerService = {
  listManufacturers,
};
