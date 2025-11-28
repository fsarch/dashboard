'use server';

import { AttributeCreateDto } from "@/services/product/attribute.type";
import { attributeService } from "@/services/product/attribute.service";

export async function createAttribute(catalogId: string, createDto: AttributeCreateDto) {
  console.log(catalogId, createDto);
  const response = await attributeService.createAttribute(catalogId, createDto);
  console.log(JSON.stringify(response));
}
