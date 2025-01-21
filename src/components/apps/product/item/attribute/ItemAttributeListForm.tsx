'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { Form, Formik, FormikHelpers } from "formik";
import {
  ItemAttributeListFormDataType
} from "@/components/apps/product/item/attribute/ItemAttributeListForm.server-action";


type ItemAttributeListFormProps = PropsWithChildren<{
  initialValue: ItemAttributeListFormDataType;
}>;

const ItemAttributeListForm: React.FunctionComponent<ItemAttributeListFormProps> = ({
  children,
  initialValue,
}) => {
  const handleSubmit = useCallback(async (values: ItemAttributeListFormDataType, helper: FormikHelpers<ItemAttributeListFormDataType>) => {
    console.log('values', values);
  }, []);

  console.log('initialValue', initialValue);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={initialValue}
    >
      <Form>
        {children}
      </Form>
    </Formik>
  );
};

export default ItemAttributeListForm;
