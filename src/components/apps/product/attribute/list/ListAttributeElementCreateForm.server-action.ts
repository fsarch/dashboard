'use server';

import { ListAttributeElementCreateDto } from "@/services/product/attribute.type";
import { attributeService } from "@/services/product/attribute.service";

export async function createListAttributeElement(
  catalogId: string,
  attributeId: string,
  createDto: ListAttributeElementCreateDto,
) {
  await attributeService.createAttributeElement(catalogId, attributeId, createDto);
}
