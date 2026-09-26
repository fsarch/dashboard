'use client';

import { Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { setAttributeElementLocalization } from '@/components/apps/product/attribute/list/element-localization/AttributeElementLocalization.server-action';
import { updateAttributeLocalization } from '@/components/apps/product/attribute/localization/AttributeLocalization.server-action';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import TextArea from '@/components/universals/forms/TextArea';
import {
  AttributeLocalizationDto,
  type ElementLocalizationCreateDto,
  type ElementLocalizationDto,
} from '@/services/product/attribute.type';

type AttributeElementLocalizationProps = {
  catalogId: string;
  attributeId: string;
  elementId: string;
  localizationId: string;
  elementLocalization?: ElementLocalizationDto;
};

const AttributeElementLocalization: React.FunctionComponent<
  AttributeElementLocalizationProps
> = ({
  catalogId,
  attributeId,
  elementId,
  localizationId,
  elementLocalization,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (values: ElementLocalizationCreateDto) => {
      await setAttributeElementLocalization(
        catalogId,
        attributeId,
        elementId,
        localizationId,
        values,
      );

      router.refresh();
    },
    [catalogId, attributeId, elementId, localizationId, router],
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        content: '',
        ...elementLocalization,
        localizationId,
      }}
    >
      <Form>
        <Input name="name" type="input" />
        <TextArea name="content" />
        <Button type="submit">Speichern</Button>
      </Form>
    </Formik>
  );
};

export default AttributeElementLocalization;
