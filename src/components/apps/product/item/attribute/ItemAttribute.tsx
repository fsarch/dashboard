import type React from 'react';
import ItemBooleanAttribute from '@/components/apps/product/item/attribute/types/ItemBooleanAttribute';
import { ItemImageAttribute } from '@/components/apps/product/item/attribute/types/ItemImageAttribute';
import ItemLinkAttribute from '@/components/apps/product/item/attribute/types/ItemLinkAttribute';
import ItemListAttribute from '@/components/apps/product/item/attribute/types/ItemListAttribute';
import ItemTextAttribute from '@/components/apps/product/item/attribute/types/ItemTextAttribute';
import { AttributeType } from '@/services/product/attribute.const';
import type {
  AttributeDto,
  ImageAttributeDto,
} from '@/services/product/attribute.type';
import type {
  ItemAttributeDto,
  ItemBooleanAttributeDto,
  ItemImageAttributeDto,
  ItemLinkAttributeDto,
  ItemListAttributeDto,
  ItemTextAttributeDto,
} from '@/services/product/item-attribute.type';

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

  if (attribute.attributeTypeId === AttributeType.IMAGE) {
    return (
      <ItemImageAttribute
        attribute={attribute as ImageAttributeDto}
        value={value as ItemImageAttributeDto}
        catalogId={catalogId}
      />
    );
  }

  return <div></div>;
};

export default ItemAttribute;
