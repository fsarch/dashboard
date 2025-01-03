'use server';

import { itemTypeService } from "@/services/product/item-type.service";
import { ItemTypeCreateDto } from "@/services/product/item-type.type";

export async function createItemType(catalogId: string, createDto: ItemTypeCreateDto) {
  await itemTypeService.createItemType(catalogId, createDto);
}
