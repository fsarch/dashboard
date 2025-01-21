import React from 'react';
import { itemService } from "@/services/product/item.service";
import { attributeService } from "@/services/product/attribute.service";
import { itemTypeService } from "@/services/product/item-type.service";
import Section from "@/components/universals/section/Section";
import { AttributeDto } from "@/services/product/attribute.type";
import { ItemAttributeDto } from "@/services/product/item-attribute.type";
import ItemAttribute from "@/components/apps/product/item/attribute/ItemAttribute";
import ItemAttributeListForm from "@/components/apps/product/item/attribute/ItemAttributeListForm";
import {
  ItemAttributeListFormDataType
} from "@/components/apps/product/item/attribute/ItemAttributeListForm.server-action";
import Button from "@/components/universals/forms/Button";

type ItemAttributeListProps = {
  catalogId: string;
  itemId: string;
};

const ItemAttributeList: React.FunctionComponent<ItemAttributeListProps> = async ({
  catalogId,
  itemId,
}) => {
  const item = await itemService.getItem(catalogId, itemId);
  const attributes = await attributeService.listAttributes(catalogId);
  const itemTypeAttributes = await itemTypeService.listAttributes(catalogId, item.itemTypeId);
  const itemTypeBasedAttributes = itemTypeAttributes
    .map((itemTypeAttribute) => {
      const attribute = attributes.find(a => itemTypeAttribute.attributeId === a.id);
      if (!attribute) {
        return null;
      }

      const itemAttribute = item.attributes?.find((ita) => ita.attribute.id === attribute.id);

      return {
        attribute,
        value: itemAttribute,
        isRequired: itemTypeAttribute.isRequired,
      };
    })
    .filter(a => a) as Array<{ isRequired: boolean; attribute: AttributeDto; value: ItemAttributeDto }>;

  const initialValue = itemTypeBasedAttributes.reduce((acc, value) => {
    acc.attributes[value.attribute.id] = value.value;

    return acc;
  }, { attributes: {} } as ItemAttributeListFormDataType);

  console.log('itemTypeBasedAttributes', itemTypeBasedAttributes);

  return (
    <div>
      <h2>
        Attribute
      </h2>
      <ItemAttributeListForm
        initialValue={initialValue}
      >
        {itemTypeBasedAttributes.map((ita) => (
          <Section
            name={ita.attribute.name}
            key={ita.attribute.id}
          >
            <ItemAttribute
              attribute={ita.attribute}
              value={ita.value}
              isRequired={ita.isRequired}
            />
          </Section>
        ))}
        <Button type="submit">Speichern</Button>
      </ItemAttributeListForm>
    </div>
  );
};

export default ItemAttributeList;
