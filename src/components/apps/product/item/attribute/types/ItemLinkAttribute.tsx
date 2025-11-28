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
      {elements.map(async (element, idx) => (
        <div key={element.id}>
        <label>
          <Checkbox
            name={`attributes['${attribute.id}'].value[${idx}].id`}
            value={element.id}
          />
          {element.name}
        </label>
        </div>
      ))}
      <div>
        <SearchableSelect
          name={`attributes['${attribute.id}'].value[${elements.length}].id`}
          values={selectableItems.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
        />
      </div>
    </div>
  );
};

export default ItemLinkAttribute;
