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

export type ItemBooleanAttributeDto = ItemAttributeBaseDto & {
  attributeTypeId: AttributeType.BOOLEAN;

  value: boolean;
};

export type ItemListAttributeDto = ItemAttributeBaseDto & {
  attributeTypeId: AttributeType.LIST;

  value: Array<{
    id: string;
  }>;
};

export type ItemLinkAttributeDto = ItemAttributeBaseDto & {
  attributeTypeId: AttributeType.LINK;

  value: Array<{
    itemId: string;
  }>;
};
export type ItemImageAttributeDto = ItemAttributeBaseDto & {
  attributeTypeId: AttributeType.IMAGE;

  value: Array<{
    imageId: string;
    imageUrl: string;
  }>;
};

export type ItemAttributeDto = ItemTextAttributeDto | ItemListAttributeDto | ItemBooleanAttributeDto | ItemLinkAttributeDto | ItemImageAttributeDto;
