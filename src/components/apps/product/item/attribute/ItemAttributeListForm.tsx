'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { Form, Formik, FormikHelpers } from "formik";
import {
  ItemAttributeListFormDataType, setItemAttributes
} from "@/components/apps/product/item/attribute/ItemAttributeListForm.server-action";


type ItemAttributeListFormProps = PropsWithChildren<{
  initialValue: ItemAttributeListFormDataType;
  catalogId: string;
  itemId: string;
}>;

const ItemAttributeListForm: React.FunctionComponent<ItemAttributeListFormProps> = ({
  children,
  initialValue,
  catalogId,
  itemId,
}) => {
  const handleSubmit = useCallback(async (values: ItemAttributeListFormDataType, helper: FormikHelpers<ItemAttributeListFormDataType>) => {
    console.log('values', values);
    await setItemAttributes(catalogId, itemId, values);
  }, [catalogId, itemId]);

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
