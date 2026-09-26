'use server';

import { attributeService } from '@/services/product/attribute.service';
import type { ElementLocalizationCreateDto } from '@/services/product/attribute.type';

export async function setAttributeElementLocalization(
  catalogId: string,
  attributeId: string,
  elementId: string,
  localizationId: string,
  setDto: ElementLocalizationCreateDto,
) {
  await attributeService.setAttributeElementLocalization(
    catalogId,
    attributeId,
    elementId,
    localizationId,
    setDto,
  );
}
