'use client';

import React, { useCallback, useState } from 'react';
import { Form, Formik } from "formik";
import Input from "@/components/universals/forms/Input";
import { renderPdf, TPdfRenderFormData } from "@/components/apps/pdf-render/PdfRenderForm.server-action";
import TextArea from "@/components/universals/forms/TextArea";
import Select from "@/components/universals/forms/Select";
import Section from "@/components/universals/section/Section";
import Button from "@/components/universals/forms/Button";

type PdfRenderFormProps = {};

const PdfRenderForm: React.FunctionComponent<PdfRenderFormProps> = () => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const handleSubmit = useCallback(async (values: TPdfRenderFormData) => {
    setDataUrl(null);

    const data = await renderPdf(values);

    setDataUrl(`data:application/pdf;base64,${data.base64}`);
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          content: {
            html: '',
          },
          options: {
            viewport: {
              width: 2480,
              height: 3508,
            },
            export: {
              format: 'a4',
            },
          },
        }}
        onSubmit={handleSubmit}
      >
        <Form>
          <Section name="Content">
            <TextArea name="content.html"/>
          </Section>

          <Section
            name="Viewport"
          >
            <Input name="options.viewport.width" type="input"/>
            <Input name="options.viewport.height" type="input"/>
          </Section>

          <Section name="Output format">
            <Select
              name="options.export.format"
              values={[
                {
                  value: 'a0',
                  label: 'DIN A0',
                },
                {
                  value: 'a1',
                  label: 'DIN A1',
                },
                {
                  value: 'a2',
                  label: 'DIN A2',
                },
                {
                  value: 'a3',
                  label: 'DIN A3',
                },
                {
                  value: 'a4',
                  label: 'DIN A4',
                },
                {
                  value: 'a5',
                  label: 'DIN A5',
                },
                {
                  value: 'a6',
                  label: 'DIN A6',
                },
                {
                  value: 'letter',
                  label: 'Letter',
                },
                {
                  value: 'legal',
                  label: 'Legal',
                },
                {
                  value: 'tabloid',
                  label: 'Tabloid',
                },
                {
                  value: 'ledger',
                  label: 'Ledger',
                },
              ]}
            />
          </Section>

          <Button type="submit">
            Create
          </Button>
        </Form>
      </Formik>
      {dataUrl ? (
        <embed
          type="application/pdf"
          src={dataUrl}
          width="100%"
          height="600px"
        />
      ) : undefined}
    </>
  );
};

export default PdfRenderForm;
