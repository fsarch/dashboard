import React from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import {
  ItemAttributeDto,
  ItemBooleanAttributeDto, ItemLinkAttributeDto,
  ItemListAttributeDto,
  ItemTextAttributeDto
} from "@/services/product/item-attribute.type";
import { AttributeType } from "@/services/product/attribute.const";
import ItemTextAttribute from "@/components/apps/product/item/attribute/types/ItemTextAttribute";
import ItemListAttribute from "@/components/apps/product/item/attribute/types/ItemListAttribute";
import ItemLinkAttribute from "@/components/apps/product/item/attribute/types/ItemLinkAttribute";
import ItemBooleanAttribute from "@/components/apps/product/item/attribute/types/ItemBooleanAttribute";

type ItemAttributeProps = {
  id?: string;
  attribute: AttributeDto;
  value: ItemAttributeDto;
  isRequired: boolean;
  catalogId: string;
};

const ItemAttribute: React.FunctionComponent<ItemAttributeProps> = ({
  id,
  attribute,
  value,
  catalogId,
}) => {
  if (attribute.attributeTypeId === AttributeType.TEXT) {
    return (
      <ItemTextAttribute
        id={id}
        attribute={attribute}
        value={value as ItemTextAttributeDto}
      />
    );
  }

  if (attribute.attributeTypeId === AttributeType.BOOLEAN) {
    return (
      <ItemBooleanAttribute
        id={id}
        attribute={attribute}
        value={value as ItemBooleanAttributeDto}
      />
    );
  }

  if (attribute.attributeTypeId === AttributeType.LIST) {
    return (
      <ItemListAttribute
        attribute={attribute}
        value={value as ItemListAttributeDto}
        catalogId={catalogId}
      />
    );
  }

  if (attribute.attributeTypeId === AttributeType.LINK) {
    return (
      <ItemLinkAttribute
        attribute={attribute}
        value={value as ItemLinkAttributeDto}
        catalogId={catalogId}
      />
    );
  }

  return (
    <div>

    </div>
  );
};

export default ItemAttribute;
