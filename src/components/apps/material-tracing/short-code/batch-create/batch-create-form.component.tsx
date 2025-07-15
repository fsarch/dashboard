'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { Form, Formik } from "formik";
import { base64Utils } from "@/utils/base64.utils";
import Input from "@/components/universals/forms/Input";
import SimpleFieldsetRow from "@/components/universals/forms/SimpleFieldsetRow.component";
import { batchCreateShortCodes } from "./batch-create-form.server-action";

type BatchCreateFormProps = PropsWithChildren<{

}>;

const BatchCreateForm: React.FunctionComponent<BatchCreateFormProps> = ({
  children,
}) => {
  const handleSubmit = useCallback(async (values: { amount: number }) => {
    if (!values.amount || values.amount < 1 || values.amount > 100) {
      alert('Amount must be between 1 and 100');
      return;
    }

    try {
      const result = await batchCreateShortCodes(Number(values.amount));
      
      if (result.success) {
        // Open the generated PDF
        const contentType = 'application/pdf';
        base64Utils.open(contentType, result.base64);
        
        // Show success message
        alert(`Successfully created ${result.shortCodes.length} short codes!`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating short codes:', error);
      alert('Error creating short codes. Please try again.');
    }
  }, []);

  return (
    <Formik
      initialValues={{ amount: 1 }}
      onSubmit={handleSubmit}
    >
      <Form>
        <SimpleFieldsetRow
          label="Amount of Short Codes (max. 100)"
        >
          {(id) => (
            <Input
              id={id}
              name="amount"
              type="number"
              min={1}
              max={100}
              required
            />
          )}
        </SimpleFieldsetRow>
        {children}
      </Form>
    </Formik>
  );
};

export default BatchCreateForm;