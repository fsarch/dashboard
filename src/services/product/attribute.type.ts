import { AttributeType } from "@/services/product/attribute.const";

export type AttributeDto = {
  id: string;

  name: string;

  localizations: Array<AttributeLocalizationDto>;
};

export type AttributeLocalizationDto = {
  id: string;

  localizationId: string;
}

export type AttributeCreateDto = {
  name: string;

  attributeTypeId: AttributeType;
}
