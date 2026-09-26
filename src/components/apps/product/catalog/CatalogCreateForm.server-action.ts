'use server';

import { catalogService } from '@/services/product/catalog.service';
import type { CreateCatalogDto } from '@/services/product/catalog.type';

export async function createCatalog(createCatalogDto: CreateCatalogDto) {
  await catalogService.createCatalog(createCatalogDto);
}
