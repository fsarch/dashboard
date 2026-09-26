'use client';

import type React from 'react';
import Input from '@/components/universals/forms/Input';
import type { AttributeDto } from '@/services/product/attribute.type';
import type { ItemTextAttributeDto } from '@/services/product/item-attribute.type';

type ItemTextAttributeProps = {
  id?: string;
  attribute: AttributeDto;
  value?: ItemTextAttributeDto;
};

const ItemTextAttribute: React.FunctionComponent<ItemTextAttributeProps> = ({
  id,
  attribute,
  value,
}) => {
  console.log(`attributes['${attribute.id}'].value`);

  return (
    <Input id={id} type="text" name={`attributes['${attribute.id}'].value`} />
  );
};

export default ItemTextAttribute;
