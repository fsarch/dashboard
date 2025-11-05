import React from 'react';
import Fieldset from "@/components/universals/forms/Fieldset.component";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";
import Button from "@/components/universals/forms/Button";
import Section from "@/components/universals/section/Section";
import { ItemTypeDto } from "@/services/product/item-type.type";
import AttributeFilter from "@/components/apps/product/item/queryable-list/AttributeFilter";

type QueryableItemListFilterSectionProps = {
  itemTypes: Array<ItemTypeDto>;
  filteredItemTypeIds?: Array<string>;
  catalogId: string;
  attributes?: Record<string, string>;
};

const QueryableItemListFilterSection: React.FunctionComponent<QueryableItemListFilterSectionProps> = ({
  catalogId,
  itemTypes,
  filteredItemTypeIds,
  attributes,
}) => {
  return (
    <Section name="Suchfilter">
      <form method="GET">
        <Fieldset>
          <FieldsetRow label="Item Typen">
            {itemTypes.map(({ id, name }) => (
              <div key={id}>
                <label>
                  <input type="checkbox" name="itemTypeId" value={id} defaultChecked={filteredItemTypeIds?.includes(id)}/>
                  {name}
                </label>
              </div>
            ))}
          </FieldsetRow>
          <AttributeFilter
            catalogId={catalogId}
            activeAttributeFilters={attributes}
          />
        </Fieldset>

        <Button type="submit">
          Suchen
        </Button>
      </form>
    </Section>
  );
};

export default QueryableItemListFilterSection;
