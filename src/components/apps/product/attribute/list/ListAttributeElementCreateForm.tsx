'use client';

import React, { useCallback } from 'react';
import { Form, Formik } from "formik";
import { ListAttributeElementCreateDto } from "@/services/product/attribute.type";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import {
  createListAttributeElement
} from "@/components/apps/product/attribute/list/ListAttributeElementCreateForm.server-action";
import { useRouter } from "next/navigation";

type ListAttributeElementListProps = {
  catalogId: string;
  attributeId: string;
};

const ListAttributeElementList: React.FunctionComponent<ListAttributeElementListProps> = async ({
  catalogId,
  attributeId,
}) => {
  const router = useRouter();
  const handleSubmit = useCallback(async (values: ListAttributeElementCreateDto) => {
    await createListAttributeElement(catalogId, attributeId, values);

    router.refresh();
  }, [router, catalogId, attributeId]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
      }}
    >
      <Form>
        <Input name="name" type="input"/>
        <Button type="submit">Erstellen</Button>
      </Form>
    </Formik>
  );
};

export default ListAttributeElementList;
