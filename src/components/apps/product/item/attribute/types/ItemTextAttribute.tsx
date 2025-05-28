'use client';

import React from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { ItemTextAttributeDto } from "@/services/product/item-attribute.type";
import Input from "@/components/universals/forms/Input";

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
  console.log(`attributes['${attribute.id}'].value`)

  return (
    <Input
      id={id}
      type="text"
      name={`attributes['${attribute.id}'].value`}
    />
  );
};

export default ItemTextAttribute;
