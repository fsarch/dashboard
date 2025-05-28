import React from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { ItemAttributeDto } from "@/services/product/item-attribute.type";
import { AttributeType } from "@/services/product/attribute.const";
import ItemTextAttribute from "@/components/apps/product/item/attribute/types/ItemTextAttribute";

type ItemAttributeProps = {
  id?: string;
  attribute: AttributeDto;
  value: ItemAttributeDto;
  isRequired: boolean;
};

const ItemAttribute: React.FunctionComponent<ItemAttributeProps> = ({
  id,
  attribute,
  value,
}) => {
  if (attribute.attributeTypeId === AttributeType.TEXT) {
    return (
      <ItemTextAttribute
        id={id}
        attribute={attribute}
        value={value}
      />
    );
  }

  return (
    <div>

    </div>
  );
};

export default ItemAttribute;
