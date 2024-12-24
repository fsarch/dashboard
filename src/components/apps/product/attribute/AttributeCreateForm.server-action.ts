'use server';

import { AttributeCreateDto } from "@/services/product/attribute.type";
import { attributeService } from "@/services/product/attribute.service";

export async function createAttribute(catalogId: string, createDto: AttributeCreateDto) {
  await attributeService.createAttribute(catalogId, createDto);
}
