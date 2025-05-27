'use client';

import React, { useCallback } from 'react';
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import { useRouter } from "next/navigation";
import {
  connectPartPartShortCode,
} from "@/components/apps/material-tracing/short-code/part/PartPartShortCodeConnectForm.server-action";
import QrInput from "@/components/universals/forms/QrInput";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";

type PartPartShortCodeConnectFormProps = {
  partId: string;
};

type ConnectPartPartShortCodeFormData = {
  shortCode: string;
  amount: string;
};

export const PartPartShortCodeConnectForm: React.FunctionComponent<PartPartShortCodeConnectFormProps> = ({
  partId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (value: ConnectPartPartShortCodeFormData) => {
    await connectPartPartShortCode({
      value: {
        shortCode: value.shortCode,
        amount: parseInt(value.amount, 10),
      },
      partId,
    });
    router.refresh();
  }, [router, partId]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        shortCode: '',
        amount: '1',
      }}
    >
      <Form>
        <Fieldset>
          <FieldsetRow
            label={(
              <label htmlFor="part-part-short-code">ShortCode</label>
            )}
          >
            <QrInput
              id="part-part-short-code"
              name="shortCode"
            />
          </FieldsetRow>
          <FieldsetRow
            label={(
              <label htmlFor="part-part-amount">Anzahl</label>
            )}
          >
            <Input id="part-part-amount" name="amount" type="number"/>
          </FieldsetRow>
        </Fieldset>
        <Button type="submit">
          Erstellen
        </Button>
      </Form>
    </Formik>
  );
};
