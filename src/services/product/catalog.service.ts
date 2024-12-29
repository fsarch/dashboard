import { fetchService } from "@/utils/fetchService";
import type { CatalogDto, CreateCatalogDto } from "@/services/product/catalog.type";

const listCatalogs = async (): Promise<Array<CatalogDto>> => {
  const catalogResponse = await fetchService('/v1/catalogs');
  const catalogs = await catalogResponse.json();

  return catalogs;
};

const createCatalog = async (createDto: CreateCatalogDto): Promise<{ id: string; }> => {
  const catalogCreateResponse = await fetchService('/v1/catalogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createDto),
  });
  const catalogCreateResult = await catalogCreateResponse.json();

  return catalogCreateResult;
};

export const catalogService = {
  listCatalogs,
  createCatalog,
};
