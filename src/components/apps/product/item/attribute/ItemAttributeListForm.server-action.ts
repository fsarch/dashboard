'use server';

import { ItemAttributeDto } from "@/services/product/item-attribute.type";
import { itemAttributeService } from "@/services/product/item-attribute.service";
import { itemTypeService } from "@/services/product/item-type.service";
import { itemService } from "@/services/product/item.service";
import { AttributeType } from "@/services/product/attribute.const";

export type ItemAttributeListFormDataType = {
  attributes: Record<string, ItemAttributeDto>;
};

export async function setItemAttributes(catalogId: string, itemId: string, formData: ItemAttributeListFormDataType) {
  const item = await itemService.getItem(catalogId, itemId);
  const attributes = await itemTypeService.listAttributes(catalogId, item.itemTypeId, {
    embed: ['attribute'],
  });

  const results: Array<{ status: number; data: unknown }> = [];

  for (let attribute of attributes) {
    if (!(attribute.attributeId in formData.attributes)) {
      continue;
    }

    try {
      let value = formData.attributes[attribute.attributeId];
      if (attribute.attribute?.attributeTypeId === AttributeType.LIST) {
        value.value = (value.value as unknown as Array<string>).map((id) => ({ id })) as any;
      }

      console.log('test124', catalogId, itemId, attribute.attributeId, value);

      const res = await itemAttributeService.setItemAttribute(catalogId, itemId, attribute.attributeId, value);
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
