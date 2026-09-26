'use server';

import { localizationService } from '@/services/product/localization.service';
import type { LocalizationCreateDto } from '@/services/product/localization.type';

export async function createLocalization(createDto: LocalizationCreateDto) {
  await localizationService.createLocalization(createDto);
}
