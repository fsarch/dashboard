import { AttributeType } from "@/services/product/attribute.const";

export type ItemAttributeBaseDto = {
  id: string;

  attributeTypeId: AttributeType;
};

export type ItemTextAttributeDto = ItemAttributeBaseDto & {
  attributeTypeId: AttributeType.TEXT;

  value: string;
};

export type ItemAttributeDto = ItemTextAttributeDto;
