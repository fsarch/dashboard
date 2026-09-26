import { AttributeType } from '@/services/product/attribute.const';
import type {
  ItemAttributeDto,
  ItemListAttributeDto,
} from '@/services/product/item-attribute.type';

export function isListItemAttribute(
  value: ItemAttributeDto,
): value is ItemListAttributeDto {
  return value.attribute.attributeTypeId === AttributeType.LIST;
}
