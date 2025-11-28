'use server';

import { itemTypeService } from "@/services/product/item-type.service";

export async function loadItemTypes(catalogId: string) {
  return await itemTypeService.listItemTypes(catalogId);
}
