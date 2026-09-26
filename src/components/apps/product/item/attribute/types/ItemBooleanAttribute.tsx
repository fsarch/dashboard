'use client';

import type React from 'react';
import Checkbox from '@/components/universals/forms/Checkbox';
import type { AttributeDto } from '@/services/product/attribute.type';
import type { ItemBooleanAttributeDto } from '@/services/product/item-attribute.type';

type ItemBooleanAttributeProps = {
  id?: string;
  attribute: AttributeDto;
  value?: ItemBooleanAttributeDto;
};

const ItemBooleanAttribute: React.FunctionComponent<
  ItemBooleanAttributeProps
> = ({ id, attribute, value }) => {
  return <Checkbox id={id} name={`attributes['${attribute.id}'].value`} />;
};

export default ItemBooleanAttribute;
