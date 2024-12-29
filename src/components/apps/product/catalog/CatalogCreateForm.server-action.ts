'use server';

import { CreateCatalogDto } from "@/services/product/catalog.type";
import { catalogService } from "@/services/product/catalog.service";

export async function createCatalog(createCatalogDto: CreateCatalogDto) {
  await catalogService.createCatalog(createCatalogDto);
}
