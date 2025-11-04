'use client';

import React from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { ItemBooleanAttributeDto } from "@/services/product/item-attribute.type";
import Checkbox from "@/components/universals/forms/Checkbox";

type ItemBooleanAttributeProps = {
  id?: string;
  attribute: AttributeDto;
  value?: ItemBooleanAttributeDto;
};

const ItemBooleanAttribute: React.FunctionComponent<ItemBooleanAttributeProps> = ({
  id,
  attribute,
  value,
}) => {
  return (
    <Checkbox
      id={id}
      name={`attributes['${attribute.id}'].value`}
    />
  );
};

export default ItemBooleanAttribute;
