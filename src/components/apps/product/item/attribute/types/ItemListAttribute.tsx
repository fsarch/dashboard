import type React from 'react';
import Checkbox from '@/components/universals/forms/Checkbox';
import { attributeService } from '@/services/product/attribute.service';
import type { AttributeDto } from '@/services/product/attribute.type';
import type { ItemListAttributeDto } from '@/services/product/item-attribute.type';

type ItemListAttributeProps = {
  attribute: AttributeDto;
  value?: ItemListAttributeDto;
  catalogId: string;
};

const ItemListAttribute: React.FunctionComponent<
  ItemListAttributeProps
> = async ({ attribute, value, catalogId }) => {
  const elements = await attributeService.getAttributeElements(
    catalogId,
    attribute.id,
  );

  return (
    <div>
      {elements.map(async (element) => (
        <div key={element.id}>
          <label>
            <Checkbox
              name={`attributes['${attribute.id}'].value`}
              value={element.id}
            />
            {element.name}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ItemListAttribute;
