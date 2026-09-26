'use server';

import { itemService } from '@/services/product/item.service';
import type { ItemCreateDto } from '@/services/product/item.type';

export async function createItem(
  catalogId: string,
  itemCreateDto: ItemCreateDto,
) {
  return await itemService.createItem(catalogId, itemCreateDto);
}
