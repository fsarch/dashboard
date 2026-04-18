import { fetchService } from "@/utils/fetchService";
import { TManufacturer } from "@/services/material-tracing/manufacturer.type";
import { TPaginationResult } from "@/services/material-tracing/pagination.type";

const listManufacturers = async (options?: {
  skip?: number;
  take?: number;
  search?: string;
}): Promise<TPaginationResult<TManufacturer>> => {
  const url = new URL('/v1/manufacturers', 'http://localhost');

  if (options?.skip !== undefined) {
    url.searchParams.append('skip', options.skip.toString());
  }

  if (options?.take !== undefined) {
    url.searchParams.append('take', options.take.toString());
  }

  if (options?.search) {
    url.searchParams.append('search', options.search);
  }

  const manufacturersResponse = await fetchService(url.pathname + url.search);
  return await manufacturersResponse.json();
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
