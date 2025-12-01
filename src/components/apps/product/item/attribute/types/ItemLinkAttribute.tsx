import React from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { ItemLinkAttributeDto } from "@/services/product/item-attribute.type";
import { attributeService } from "@/services/product/attribute.service";
import Checkbox from "@/components/universals/forms/Checkbox";
import SearchableSelect from "@/components/universals/forms/searchable-select/SearchableSelect.component";
import { itemService } from "@/services/product/item.service";

type ItemLinkAttributeProps = {
  attribute: AttributeDto;
  value?: ItemLinkAttributeDto;
  catalogId: string;
};

const ItemLinkAttribute: React.FunctionComponent<ItemLinkAttributeProps> = async ({
  attribute,
  value,
  catalogId,
}) => {
  const elements = await attributeService.getAttributeElements(catalogId, attribute.id);
  const selectableItems = await itemService.listItems(catalogId, undefined, {

  });

  console.log('attribute', attribute);

  return (
    <div>
      <SearchableSelect
        name={`attributes['${attribute.id}'].value[0].id`}
        values={selectableItems.map((item) => ({
          label: item.name,
          value: item.id,
        }))}
      />
    </div>
  );
};

export default ItemLinkAttribute;
