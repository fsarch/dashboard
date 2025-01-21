'use client';

import React from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { ItemTextAttributeDto } from "@/services/product/item-attribute.type";
import Input from "@/components/universals/forms/Input";

type ItemTextAttributeProps = {
  attribute: AttributeDto;
  value?: ItemTextAttributeDto;
};

const ItemTextAttribute: React.FunctionComponent<ItemTextAttributeProps> = ({
  attribute,
  value,
}) => {
  console.log(`attributes['${attribute.id}'].value`)

  return (
    <Input
      type="text"
      name={`attributes['${attribute.id}'].value`}
    />
  );
};

export default ItemTextAttribute;
