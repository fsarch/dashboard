'use client';

import React, { useCallback } from 'react';
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import {
  connectPartMaterialShortCode, ConnectPartMaterialShortCode
} from "@/components/apps/material-tracing/short-code/part/PartMaterialShortCodeConnectForm.server-action";
import { useRouter } from "next/navigation";

type PartMaterialShortCodeConnectFormProps = {
  partId: string;
};


export const PartMaterialShortCodeConnectForm: React.FunctionComponent<PartMaterialShortCodeConnectFormProps> = ({
  partId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (value: ConnectPartMaterialShortCode) => {
    await connectPartMaterialShortCode({
      value,
      partId,
    });
    router.refresh();
  }, [router, partId]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        shortCode: '',
      }}
    >
      <Form>
        <Input name="shortCode" type="input"/>
        <Button type="submit">
          Erstellen
        </Button>
      </Form>
    </Formik>
  );
};
