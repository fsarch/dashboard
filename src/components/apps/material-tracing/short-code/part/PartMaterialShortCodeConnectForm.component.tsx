'use client';

import React, { useCallback } from 'react';
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import {
  connectPartMaterialShortCode, ConnectPartMaterialShortCode
} from "@/components/apps/material-tracing/short-code/part/PartMaterialShortCodeConnectForm.server-action";
import { useRouter } from "next/navigation";
import QrInput from "@/components/universals/forms/QrInput";
import { useWithLoading } from "@/components/universals/loader/LoadingProvider.context";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";

type PartMaterialShortCodeConnectFormProps = {
  partId: string;
};


export const PartMaterialShortCodeConnectForm: React.FunctionComponent<PartMaterialShortCodeConnectFormProps> = ({
  partId,
}) => {
  const router = useRouter();

  const withLoader = useWithLoading();

  const handleSubmit = useCallback(async (value: ConnectPartMaterialShortCode) => {
    await withLoader(() => connectPartMaterialShortCode({
      value,
      partId,
    }));
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
        <Fieldset>
          <FieldsetRow
            label={(
              <label htmlFor="part-material-short-code">ShortCode</label>
            )}
          >
            <QrInput
              id="part-material-short-code"
              name="shortCode"
            />
          </FieldsetRow>
        </Fieldset>
        <Button type="submit">
          Verbinden
        </Button>
      </Form>
    </Formik>
  );
};
