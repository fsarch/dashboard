'use server';

import { attributeService } from '@/services/product/attribute.service';
import type { AttributeLocalizationDto } from '@/services/product/attribute.type';

export async function updateAttributeLocalization(
  catalogId: string,
  attributeId: string,
  value: Omit<AttributeLocalizationDto, 'id'>,
) {
  await attributeService.setAttributeLocalization(
    catalogId,
    attributeId,
    value,
  );
}
