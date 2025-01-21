'use server';

import { ItemAttributeDto } from "@/services/product/item-attribute.type";
import { itemAttributeService } from "@/services/product/item-attribute.service";

export type ItemAttributeListFormDataType = {
  attributes: Record<string, ItemAttributeDto>;
};

export async function setItemAttributes(catalogId: string, itemId: string, formData: ItemAttributeListFormDataType) {
  const elements = Object.entries(formData.attributes);

  const results: Array<{ status: number; data: unknown }> = [];

  for (let i = 0; i < elements.length; i++) {
    try {
      const res = await itemAttributeService.setItemAttribute(catalogId, itemId, elements[i][0], elements[i][1]);
      results.push({
        status: 201,
        data: res,
      });
    } catch (error) {
      results.push({
        status: 500,
        data: error,
      });
    }
  }

  return results;
}
