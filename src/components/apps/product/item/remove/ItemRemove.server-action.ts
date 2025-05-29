'use server';

import { itemService } from "@/services/product/item.service";

export async function removeItem(catalogId: string, itemId: string) {
  await itemService.deleteItem(catalogId, itemId);
}
