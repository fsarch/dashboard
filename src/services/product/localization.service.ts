import type {
  LocalizationCreateDto,
  LocalizationDto,
} from '@/services/product/localization.type';
import { fetchService } from '@/utils/fetchService';

const listLocalizations = async (): Promise<Array<LocalizationDto>> => {
  const localizationResponse = await fetchService(`/v1/localizations`);
  const localization = await localizationResponse.json();

  return localization;
};

const createLocalization = async (
  createDto: LocalizationCreateDto,
): Promise<LocalizationDto> => {
  const localizationResponse = await fetchService(`/v1/localizations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createDto),
  });
  const localization = await localizationResponse.json();

  return localization;
};

export const localizationService = {
  listLocalizations,
  createLocalization,
};
