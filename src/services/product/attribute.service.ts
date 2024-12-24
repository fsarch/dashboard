import { fetchService } from "@/utils/fetchService";
import { AttributeCreateDto, AttributeDto, AttributeLocalizationDto } from "@/services/product/attribute.type";

const listAttributes = async (catalogId: string, options: { include: Array<'localizations'> } = { include: [] }): Promise<Array<AttributeDto>> => {
  const attributeResponse = await fetchService(`/v1/catalogs/${catalogId}/attributes?include=${encodeURIComponent(options.include.join(','))}`);
  const attributes = await attributeResponse.json();

  return attributes;
};

const getAttribute = async (
  catalogId: string,
  attributeId: string,
  options: { include: Array<'localizations'> } = { include: [] },
): Promise<AttributeDto> => {
  const attributeResponse = await fetchService(`/v1/catalogs/${catalogId}/attributes/${attributeId}?include=${encodeURIComponent(options.include.join(','))}`);
  const attribute = await attributeResponse.json();

  return attribute;
};

const createAttribute = async (
  catalogId: string,
  createDto: AttributeCreateDto,
): Promise<AttributeDto> => {
  const attributeResponse = await fetchService(`/v1/catalogs/${catalogId}/attributes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createDto),
  });
  const attribute = await attributeResponse.json();

  return attribute;
};

const setAttributeLocalization = async (
  catalogId: string,
  attributeId: string,
  setDto: Omit<AttributeLocalizationDto, 'id'>,
): Promise<AttributeDto> => {
  const attributeResponse = await fetchService(`/v1/catalogs/${catalogId}/attributes/${attributeId}/localizations/${setDto.localizationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(setDto),
  });
  const attribute = await attributeResponse.json();

  return attribute;
};

export const attributeService = {
  getAttribute,
  listAttributes,
  createAttribute,
  setAttributeLocalization,
};
