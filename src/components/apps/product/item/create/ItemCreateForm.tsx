'use client';

import React, { useCallback } from 'react';
import { ItemTypeDto } from "@/services/product/item-type.type";
import { Form, Formik, FormikHelpers } from "formik";
import { ItemCreateDto } from "@/services/product/item.type";
import Input from '@/components/universals/forms/Input';
import Button from '@/components/universals/forms/Button';
import Select from "@/components/universals/forms/Select";
import { createItem } from "@/components/apps/product/item/create/ItemCreateForm.server-action";
import { useRouter } from "next/navigation";

type ItemCreateFormProps = {
  catalogId: string;
  itemTypes: Array<ItemTypeDto>;
  parentItemId?: string;
};

const ItemCreateForm: React.FunctionComponent<ItemCreateFormProps> = ({
  itemTypes,
  catalogId,
  parentItemId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (values: ItemCreateDto, helpers: FormikHelpers<ItemCreateDto>) => {
    await createItem(catalogId, {
      ...values,
      parentItemId,
    });

    helpers.resetForm();

    router.refresh();
  }, [catalogId, router, parentItemId]);

  return (
    <Formik
      initialValues={{
        itemTypeId: itemTypes[0].id,
        name: '',
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <Input
          name="name"
          type="input"
          required
        />
        <Select
          name="itemTypeId"
          values={itemTypes.map((itemType) => ({
            value: itemType.id,
            label: itemType.name,
          }))}
        />
        <Button type="submit">Erstellen</Button>
      </Form>
    </Formik>
  );
};

export default ItemCreateForm;
