'use server';

import { ItemAttributeDto } from "@/services/product/item-attribute.type";

export type ItemAttributeListFormDataType = {
  attributes: Record<string, ItemAttributeDto>;
};

export async function setItemAttributes(catalogId: string, itemId: string, formData: ItemAttributeListFormDataType) {

}
