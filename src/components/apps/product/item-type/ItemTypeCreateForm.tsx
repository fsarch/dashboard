'use client';

import React, { useCallback } from 'react';
import { useRouter } from "next/navigation";
import { Form, Formik, FormikHelpers } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import { ItemTypeCreateDto } from "@/services/product/item-type.type";
import { createItemType } from "@/components/apps/product/item-type/ItemTypeCreateForm.server-action";

type ItemTypeCreateFormProps = {
  catalogId: string;
};

const ItemTypeCreateForm: React.FunctionComponent<ItemTypeCreateFormProps> = ({
  catalogId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (value: ItemTypeCreateDto, helpers: FormikHelpers<ItemTypeCreateDto>) => {
    await createItemType(catalogId, value);

    router.refresh();
    helpers.resetForm();
  }, [catalogId, router]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
      }}
    >
      <Form>
        <Input name="name" type="input"/>
        <Button type="submit">
          Erstellen
        </Button>
      </Form>
    </Formik>
  );
};

export default ItemTypeCreateForm;
