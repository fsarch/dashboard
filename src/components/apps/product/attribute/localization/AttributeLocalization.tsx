'use client';

import React, { useCallback } from 'react';
import { AttributeLocalizationDto } from "@/services/product/attribute.type";
import { Form, Formik } from 'formik';
import Button from "@/components/universals/forms/Button";
import Input from "@/components/universals/forms/Input";
import {
  updateAttributeLocalization
} from "@/components/apps/product/attribute/localization/AttributeLocalization.server-action";
import { useRouter } from "next/navigation";

type AttributeLocalizationProps = {
  catalogId: string;
  attributeId: string;
  localizationId: string;
  attributeLocalization?: AttributeLocalizationDto;
};

const AttributeLocalization: React.FunctionComponent<AttributeLocalizationProps> = ({
  catalogId,
  attributeId,
  localizationId,
  attributeLocalization,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (values: Omit<AttributeLocalizationDto, 'id'>) => {
    await updateAttributeLocalization(catalogId, attributeId, values);

    router.refresh();
  }, [catalogId, attributeId, router]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        ...attributeLocalization,
        localizationId,
      }}
    >
      <Form>
        <Input name="name" type="input"/>
        <Button type="submit">Speichern</Button>
      </Form>
    </Formik>
  );
};

export default AttributeLocalization;
