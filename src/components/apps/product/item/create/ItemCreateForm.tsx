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
};

const ItemCreateForm: React.FunctionComponent<ItemCreateFormProps> = ({
  itemTypes,
  catalogId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (values: ItemCreateDto, helpers: FormikHelpers<ItemCreateDto>) => {
    console.log('values', values);
    await createItem(catalogId, values);

    helpers.resetForm();

    router.refresh();
  }, [catalogId, router]);

  return (
    <Formik
      initialValues={{
        itemTypeId: itemTypes[0].id,
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <Input name="name" type="input"/>
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
