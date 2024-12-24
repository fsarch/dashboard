export type LocalizationDto = {
  id: string;

  name: string;

  countryCode: string;

  languageCode: string;
};

export type LocalizationCreateDto = {
  name: string;

  countryCode: string;

  languageCode: string;
}
