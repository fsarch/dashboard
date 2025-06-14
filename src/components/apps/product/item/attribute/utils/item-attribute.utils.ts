import { ItemAttributeDto, ItemListAttributeDto, ItemTextAttributeDto } from "@/services/product/item-attribute.type";
import { AttributeType } from "@/services/product/attribute.const";

const isTextAttribute = (attribute: ItemAttributeDto): attribute is ItemTextAttributeDto => attribute.attributeTypeId === AttributeType.TEXT;
const isListAttribute = (attribute: ItemAttributeDto): attribute is ItemListAttributeDto => attribute.attributeTypeId === AttributeType.LIST;

export const itemAttributeUtils = {
  isTextAttribute,
  isListAttribute,
};
