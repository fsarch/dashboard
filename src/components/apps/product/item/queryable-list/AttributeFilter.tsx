import type React from 'react';
import FieldsetRow from '@/components/universals/forms/FieldsetRow.component';
import { AttributeType } from '@/services/product/attribute.const';
import { attributeService } from '@/services/product/attribute.service';

type AttributeFilterProps = {
  catalogId: string;
  activeAttributeFilters?: Record<string, string>;
};

const AttributeFilter: React.FunctionComponent<AttributeFilterProps> = async ({
  catalogId,
  activeAttributeFilters = {},
}) => {
  const attributes = await attributeService.listAttributes(catalogId);

  return (
    <FieldsetRow label="Attribute">
      {attributes.map((attribute) => {
        if (attribute.attributeTypeId === AttributeType.BOOLEAN) {
          return (
            <FieldsetRow
              label={
                <label>
                  <input
                    type="checkbox"
                    name={`attribute.enable`}
                    value={attribute.id}
                    defaultChecked={!!activeAttributeFilters[attribute.id]}
                  />
                  &nbsp;{attribute.name}
                </label>
              }
              key={attribute.id}
            >
              <div>
                <label>
                  <input
                    type="radio"
                    name={`attribute.filter.${attribute.id}`}
                    value="true"
                    defaultChecked={
                      activeAttributeFilters[attribute.id] === 'true'
                    }
                  />
                  TRUE
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    name={`attribute.filter.${attribute.id}`}
                    value="false"
                    defaultChecked={
                      activeAttributeFilters[attribute.id] === 'false'
                    }
                  />
                  FALSE
                </label>
              </div>
            </FieldsetRow>
          );
        }

        return null;
      })}
    </FieldsetRow>
  );
};

export default AttributeFilter;
