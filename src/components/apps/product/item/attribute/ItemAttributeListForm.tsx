'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import type React from 'react';
import { type PropsWithChildren, useCallback } from 'react';
import {
  type ItemAttributeListFormDataType,
  setItemAttributes,
} from '@/components/apps/product/item/attribute/ItemAttributeListForm.server-action';

type ItemAttributeListFormProps = PropsWithChildren<{
  initialValue: ItemAttributeListFormDataType;
  catalogId: string;
  itemId: string;
}>;

const ItemAttributeListForm: React.FunctionComponent<
  ItemAttributeListFormProps
> = ({ children, initialValue, catalogId, itemId }) => {
  const handleSubmit = useCallback(
    async (
      values: ItemAttributeListFormDataType,
      helper: FormikHelpers<ItemAttributeListFormDataType>,
    ) => {
      console.log('values', values);
      await setItemAttributes(catalogId, itemId, values);
    },
    [catalogId, itemId],
  );

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValue}>
      <Form>{children}</Form>
    </Formik>
  );
};

export default ItemAttributeListForm;
