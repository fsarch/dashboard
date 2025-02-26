import { fetchService } from "@/utils/fetchService";
import { TManufacturer } from "@/services/material-tracing/manufacturer.type";

const listManufacturers = async (): Promise<Array<TManufacturer>> => {
  const manufacturersResponse = await fetchService('/v1/manufacturers');
  const manufacturers = await manufacturersResponse.json();

  return manufacturers;
};

const getManufacturer = async (manufacturerId: string): Promise<TManufacturer> => {
  const manufacturerResponse = await fetchService(`/v1/manufacturers/${manufacturerId}`);
  const manufacturer = await manufacturerResponse.json();

  return manufacturer;
};

export const manufacturerService = {
  listManufacturers,
  getManufacturer,
};
