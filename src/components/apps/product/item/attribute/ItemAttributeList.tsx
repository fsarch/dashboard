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
import Fieldset from "@/components/universals/forms/Fieldset.component";
import SimpleFieldsetRow from "@/components/universals/forms/SimpleFieldsetRow.component";

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

  return (
    <Section name="Attribute">
      <ItemAttributeListForm
        initialValue={initialValue}
        catalogId={catalogId}
        itemId={itemId}
      >
        <Fieldset>
          {itemTypeBasedAttributes.map((ita) => (
            <SimpleFieldsetRow
              label={ita.attribute.name}
              key={ita.attribute.id}
            >
              {(id) => (
                <ItemAttribute
                  id={id}
                  attribute={ita.attribute}
                  value={ita.value}
                  isRequired={ita.isRequired}
                />
              )}
            </SimpleFieldsetRow>
          ))}
          <Button type="submit">Speichern</Button>
        </Fieldset>
      </ItemAttributeListForm>
    </Section>
  );
};

export default ItemAttributeList;
