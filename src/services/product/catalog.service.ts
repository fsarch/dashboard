import { fetchService } from "@/utils/fetchService";
import type { CatalogDto } from "@/services/product/catalog.type";

const listCatalogs = async (): Promise<Array<CatalogDto>> => {
  const catalogResponse = await fetchService('/v1/catalogs');
  const catalogs = await catalogResponse.json();

  return catalogs;
};

export const catalogService = {
  listCatalogs,
};
