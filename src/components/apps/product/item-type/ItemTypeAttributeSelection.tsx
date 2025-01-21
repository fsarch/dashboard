'use client';

import React, { useCallback } from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import {
  AttributeItemTypeSetDto,
  updateSelection
} from "@/components/apps/product/item-type/ItemTypeAttributeSelection.server-action";
import Button from "@/components/universals/forms/Button";
import Checkbox from "@/components/universals/forms/Checkbox";
import { useRouter } from "next/navigation";

type ItemTypeAttributeSelectionProps = {
  catalogId: string;
  itemTypeId: string;
  attributes: Array<AttributeDto>;
  selectedAttributeIds: Array<string>;
};

const ItemTypeAttributeSelection: React.FunctionComponent<ItemTypeAttributeSelectionProps> = ({
  catalogId,
  itemTypeId,
  attributes,
  selectedAttributeIds,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (values: AttributeItemTypeSetDto) => {
    await updateSelection(catalogId, itemTypeId, values);

    router.refresh();
  }, [catalogId, itemTypeId, router]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        attributes: selectedAttributeIds,
      }}
    >
      <Form>
        {attributes.map((attribute: AttributeDto) => (
          <div
            key={attribute.id}
          >
            <label>
              <Checkbox
                name="attributes"
                value={attribute.id}
                disabled={selectedAttributeIds.includes(attribute.id)}
              />
              {attribute.name}
            </label>
          </div>
        ))}
        <Button type="submit">
          Speichern
        </Button>
      </Form>
    </Formik>
  );
};

export default ItemTypeAttributeSelection;
