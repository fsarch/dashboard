'use client';

import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { createListAttributeElement } from '@/components/apps/product/attribute/list/ListAttributeElementCreateForm.server-action';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import type { ListAttributeElementCreateDto } from '@/services/product/attribute.type';

type ListAttributeElementListProps = {
  catalogId: string;
  attributeId: string;
};

const ListAttributeElementList: React.FunctionComponent<
  ListAttributeElementListProps
> = ({ catalogId, attributeId }) => {
  const router = useRouter();
  const handleSubmit = useCallback(
    async (values: ListAttributeElementCreateDto) => {
      await createListAttributeElement(catalogId, attributeId, values);

      router.refresh();
    },
    [router, catalogId, attributeId],
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

export default ListAttributeElementList;
