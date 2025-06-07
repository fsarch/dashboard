'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { Form, Formik } from "formik";
import { generateQrCode } from "@/components/universals/qr-code/QRCode.utils";
import { base64Utils } from "@/utils/base64.utils";

type BatchExportFormProps = PropsWithChildren<{

}>;

const BatchExportForm: React.FunctionComponent<BatchExportFormProps> = ({
  children,
}) => {
  const handleSubmit = useCallback(async (values: { shortCodes: Array<string>; }) => {
    const response = await generateQrCode({
      values: values.shortCodes,
    });

    const contentType = 'application/pdf';

    base64Utils.open(contentType, response.base64);
  }, []);

  return (
    <Formik
      initialValues={{ shortCodes: [] }}
      onSubmit={handleSubmit}
    >
      <Form>
        {children}
      </Form>
    </Formik>
  );
};

export default BatchExportForm;
