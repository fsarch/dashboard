'use server';

import { attributeService } from '@/services/product/attribute.service';
import type { ListAttributeElementCreateDto } from '@/services/product/attribute.type';

export async function createListAttributeElement(
  catalogId: string,
  attributeId: string,
  createDto: ListAttributeElementCreateDto,
) {
  await attributeService.createAttributeElement(
    catalogId,
    attributeId,
    createDto,
  );
}
