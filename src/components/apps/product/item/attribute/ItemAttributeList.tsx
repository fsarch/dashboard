import React from 'react';
import { itemService } from "@/services/product/item.service";
import { attributeService } from "@/services/product/attribute.service";
import { itemTypeService } from "@/services/product/item-type.service";
import Section from "@/components/universals/section/Section";
import { AttributeDto, ImageAttributeDto } from "@/services/product/attribute.type";
import { ItemAttributeDto, ItemImageAttributeDto, ItemTextAttributeDto } from "@/services/product/item-attribute.type";
import ItemAttribute from "@/components/apps/product/item/attribute/ItemAttribute";
import ItemAttributeListForm from "@/components/apps/product/item/attribute/ItemAttributeListForm";
import {
  ItemAttributeListFormDataType
} from "@/components/apps/product/item/attribute/ItemAttributeListForm.server-action";
import Button from "@/components/universals/forms/Button";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import SimpleFieldsetRow from "@/components/universals/forms/SimpleFieldsetRow.component";
import { AttributeType } from "@/services/product/attribute.const";
import { isListItemAttribute } from "@/services/product/item-attribute.utils";
import { proxyRequestUtils } from "@/utils/proxy-request.utils";
import { arrayUtils } from "@/utils/array.utils";

type ItemAttributeListProps = {
  catalogId: string;
  itemId: string;
};

type CombinedAttribute<TAttr extends AttributeDto, TVal extends ItemAttributeDto> = { isRequired: boolean; attribute: TAttr; value: TVal };

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

      console.log('item', item);
      const itemAttribute = item.attributes?.find((ita) => ita.attribute.id === attribute.id);

      return {
        attribute,
        value: itemAttribute,
        isRequired: itemTypeAttribute.isRequired,
      };
    })
    .filter(a => a) as Array<CombinedAttribute<AttributeDto, ItemAttributeDto>>;

  const initialValue = await arrayUtils.asyncReduce(itemTypeBasedAttributes, async (acc, value) => {
    // default values
    if (value.attribute.attributeTypeId === AttributeType.IMAGE) {
      if (!value.value) {
        value.value = [] as any;
      }
    }
    if (value.attribute.attributeTypeId === AttributeType.LIST) {
      if (!value.value) {
        value.value = {
          value: [] as any,
        } as any;
      }
    }

    if (value.attribute.attributeTypeId === AttributeType.BOOLEAN) {
      if (!value.value) {
        value.value = {
          value: false,
        } as any;
      }
    }

    // special handling/mapping
    if (value.value && value.attribute.attributeTypeId === AttributeType.LIST) {
      value.value.value = (value.value.value as Array<{ id: string }> | undefined)?.map(({ id }) => id) as any;
    }

    if (value.attribute.attributeTypeId === AttributeType.IMAGE) {
      const imageServerUrl = (value.attribute as ImageAttributeDto).imageServerUrl;

      value.value.value = await Promise.all((value.value as ItemImageAttributeDto)?.value?.map(async (value) => {
        const imageUrl = await proxyRequestUtils.create({
          url: `${imageServerUrl}/v1/admin/images/${(value as any).id}/raw`,
          method: 'GET',
        });

        value.imageUrl = imageUrl;

        console.log('value.value', imageUrl);
        return value;
      }) ?? []) as any;
    }

    acc.attributes[value.attribute.id] = value.value;

    return acc;
  }, { attributes: {} } as ItemAttributeListFormDataType);

  console.log('initialValue', initialValue);

  return (
    <Section name="Attribute">
      <ItemAttributeListForm
        initialValue={initialValue as any}
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
                  catalogId={catalogId}
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
