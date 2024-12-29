'use server';

import { ItemCreateDto } from "@/services/product/item.type";
import { itemService } from "@/services/product/item.service";

export async function createItem(catalogId: string, itemCreateDto: ItemCreateDto) {
  return await itemService.createItem(catalogId, itemCreateDto);
}
