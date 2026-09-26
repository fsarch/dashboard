'use client';

import { Form, Formik } from 'formik';
import type React from 'react';
import { useCallback } from 'react';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import type { AttributeDto } from '@/services/product/attribute.type';
import AttributeSettings from './create/AttributeSettings';

type AttributeProps = {
  attribute: AttributeDto;
  catalogId: string;
};

const AttributeEditForm: React.FunctionComponent<AttributeProps> = ({
  attribute,
  catalogId,
}) => {
  const handleChange = useCallback((values: AttributeDto) => {
    console.log('values', values);
  }, []);

  return (
    <Formik initialValues={attribute} onSubmit={handleChange}>
      <Form>
        <Input type="input" name="name" disabled />
        <AttributeSettings catalogId={catalogId} />
        <Button type="submit">Speichern</Button>
      </Form>
    </Formik>
  );
};

export default AttributeEditForm;
