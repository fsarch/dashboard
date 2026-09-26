'use client';

import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { updateAttributeLocalization } from '@/components/apps/product/attribute/localization/AttributeLocalization.server-action';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import type { AttributeLocalizationDto } from '@/services/product/attribute.type';

type AttributeLocalizationProps = {
  catalogId: string;
  attributeId: string;
  localizationId: string;
  attributeLocalization?: AttributeLocalizationDto;
};

const AttributeLocalization: React.FunctionComponent<
  AttributeLocalizationProps
> = ({ catalogId, attributeId, localizationId, attributeLocalization }) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: Omit<AttributeLocalizationDto, 'id'>) => {
      await updateAttributeLocalization(catalogId, attributeId, values);

      router.refresh();
    },
    [catalogId, attributeId, router],
  );

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
        <Input name="name" type="input" />
        <Button type="submit">Speichern</Button>
      </Form>
    </Formik>
  );
};

export default AttributeLocalization;
