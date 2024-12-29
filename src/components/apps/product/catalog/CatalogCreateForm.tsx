'use client';

import React, { useCallback } from 'react';
import { Form, Formik, FormikHelpers } from "formik";
import Button from "@/components/universals/forms/Button";
import Input from "@/components/universals/forms/Input";
import { useRouter } from "next/navigation";
import { CreateCatalogDto } from "@/services/product/catalog.type";
import { createCatalog } from "@/components/apps/product/catalog/CatalogCreateForm.server-action";

type CatalogCreateFormProps = {
};

const CatalogCreateForm: React.FunctionComponent<CatalogCreateFormProps> = ({
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (value: CreateCatalogDto, helpers: FormikHelpers<CreateCatalogDto>) => {
    await createCatalog(value);

    router.refresh();
    helpers.resetForm();
  }, [router]);

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

export default CatalogCreateForm;
