import { fetchService } from "@/utils/fetchService";
import { TManufacturer } from "@/services/material-tracing/manufacturer.type";

const listManufacturers = async (options?: { search?: string }): Promise<Array<TManufacturer>> => {
  const url = new URL('/v1/manufacturers', 'http://localhost');

  if (options?.search) {
    url.searchParams.append('search', options.search);
  }

  const manufacturersResponse = await fetchService(url.pathname + url.search);
  const manufacturers = await manufacturersResponse.json();

  return manufacturers;
};

const getManufacturer = async (manufacturerId: string): Promise<TManufacturer> => {
  const manufacturerResponse = await fetchService(`/v1/manufacturers/${manufacturerId}`);
  const manufacturer = await manufacturerResponse.json();

  return manufacturer;
};

const deleteManufacturer = async (manufacturerId: string): Promise<void> => {
  const manufacturerResponse = await fetchService(`/v1/manufacturers/${manufacturerId}`, {
    method: 'DELETE',
  });
  if (!manufacturerResponse) {
    throw new Error('could not remove manufacturer');
  }
};

export const manufacturerService = {
  listManufacturers,
  getManufacturer,
  deleteManufacturer,
};
