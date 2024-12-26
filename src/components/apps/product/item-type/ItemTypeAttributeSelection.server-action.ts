'use server';

import { itemTypeService } from "@/services/product/item-type.service";

export type AttributeItemTypeSetDto = {
  attributes: Array<string>;
};

export async function updateSelection(catalogId: string, itemTypeId: string, setDto: AttributeItemTypeSetDto) {
  const attributeItemTypes = await itemTypeService.listAttributes(catalogId, itemTypeId);

  const newAttributes = setDto.attributes.filter((sa) => !attributeItemTypes.find(ait => ait.attributeId === sa));
  console.log('newAttributes', newAttributes, setDto.attributes);

  await Promise.all(newAttributes.map(async (attributeId) => {
    await itemTypeService.createAttribute(catalogId, itemTypeId, attributeId, {
      isRequired: true,
    });
  }));
}
