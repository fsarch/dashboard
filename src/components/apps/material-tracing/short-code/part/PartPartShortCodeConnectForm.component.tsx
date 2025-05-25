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
        <QrInput name="shortCode"/>
        <Input name="amount" type="number"/>
        <Button type="submit">
          Erstellen
        </Button>
      </Form>
    </Formik>
  );
};
