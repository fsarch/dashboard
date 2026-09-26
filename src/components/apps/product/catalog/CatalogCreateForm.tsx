'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { createCatalog } from '@/components/apps/product/catalog/CatalogCreateForm.server-action';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import type { CreateCatalogDto } from '@/services/product/catalog.type';

type CatalogCreateFormProps = {};

const CatalogCreateForm: React.FunctionComponent<
  CatalogCreateFormProps
> = ({}) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      value: CreateCatalogDto,
      helpers: FormikHelpers<CreateCatalogDto>,
    ) => {
      await createCatalog(value);

      router.refresh();
      helpers.resetForm();
    },
    [router],
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
      }}
    >
      <Form>
        <Input name="name" type="input" />
        <Button type="submit">Erstellen</Button>
      </Form>
    </Formik>
  );
};

export default CatalogCreateForm;
