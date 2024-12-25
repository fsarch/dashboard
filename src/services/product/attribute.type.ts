import { AttributeType } from "@/services/product/attribute.const";

export type AttributeDto = {
  id: string;

  name: string;

  attributeTypeId: AttributeType;

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

export type ListAttributeElementDto = {
  id: string;

  name: string;
}

export type ListAttributeElementCreateDto = {
  name: string;
}

export type ElementLocalizationDto = {
  id: string;

  name: string;

  content: string;

  localizationId: string;
};

export type ElementLocalizationCreateDto = {
  name: string;

  content: string;
};
