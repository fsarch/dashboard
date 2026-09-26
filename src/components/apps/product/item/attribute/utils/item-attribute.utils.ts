import { AttributeType } from '@/services/product/attribute.const';
import type {
  ItemAttributeDto,
  ItemListAttributeDto,
  ItemTextAttributeDto,
} from '@/services/product/item-attribute.type';

const isTextAttribute = (
  attribute: ItemAttributeDto,
): attribute is ItemTextAttributeDto =>
  attribute.attributeTypeId === AttributeType.TEXT;
const isListAttribute = (
  attribute: ItemAttributeDto,
): attribute is ItemListAttributeDto =>
  attribute.attributeTypeId === AttributeType.LIST;

export const itemAttributeUtils = {
  isTextAttribute,
  isListAttribute,
};
