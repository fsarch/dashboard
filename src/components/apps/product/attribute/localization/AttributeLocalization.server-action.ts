'use server';

import { AttributeLocalizationDto } from "@/services/product/attribute.type";
import { attributeService } from "@/services/product/attribute.service";

export async function updateAttributeLocalization(catalogId: string, attributeId: string, value: Omit<AttributeLocalizationDto, 'id'>) {
  await attributeService.setAttributeLocalization(catalogId, attributeId, value);
}
