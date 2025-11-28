import type { ItemAttributeDto, ItemListAttributeDto } from "@/services/product/item-attribute.type";
import { AttributeType } from "@/services/product/attribute.const";

export function isListItemAttribute(value: ItemAttributeDto): value is ItemListAttributeDto {
  return value.attribute.attributeTypeId === AttributeType.LIST;
}
