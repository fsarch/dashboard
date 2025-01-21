import type { AttributeType } from "@/services/product/attribute.const";
import type { AttributeDto } from "@/services/product/attribute.type";

export type ItemAttributeBaseDto = {
  id: string;

  attributeTypeId: AttributeType;

  attribute: AttributeDto;
};

export type ItemTextAttributeDto = ItemAttributeBaseDto & {
  attributeTypeId: AttributeType.TEXT;

  value: string;
};

export type ItemAttributeDto = ItemTextAttributeDto;
