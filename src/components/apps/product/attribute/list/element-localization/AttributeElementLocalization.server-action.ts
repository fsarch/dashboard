'use server';

import { ElementLocalizationCreateDto } from "@/services/product/attribute.type";
import { attributeService } from "@/services/product/attribute.service";

export async function setAttributeElementLocalization(
  catalogId: string,
  attributeId: string,
  elementId: string,
  localizationId: string,
  setDto: ElementLocalizationCreateDto,
) {
  await attributeService.setAttributeElementLocalization(catalogId, attributeId, elementId, localizationId, setDto);
}
