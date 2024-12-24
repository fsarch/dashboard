'use client';

import React, { useCallback } from 'react';
import { AttributeDto } from "@/services/product/attribute.type";
import { Form, Formik } from "formik";
import Input from '@/components/universals/forms/Input';
import Button from "@/components/universals/forms/Button";
import AttributeSettings from './create/AttributeSettings';

type AttributeProps = {
  attribute: AttributeDto;
};

const AttributeEditForm: React.FunctionComponent<AttributeProps> = ({
  attribute,
}) => {
  const handleChange = useCallback((values: AttributeDto) => {
    console.log('values', values);
  }, []);

  return (
    <Formik
      initialValues={attribute}
      onSubmit={handleChange}
    >
      <Form>
        <Input
          type="input"
          name="name"
          disabled
        />
        <AttributeSettings/>
        <Button type="submit">Speichern</Button>
      </Form>
    </Formik>
  );
};

export default AttributeEditForm;
