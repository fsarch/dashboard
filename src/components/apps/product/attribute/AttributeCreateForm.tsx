'use client';

import React, { useCallback } from 'react';
import { Form, Formik, FormikHelpers } from "formik";
import Button from "@/components/universals/forms/Button";
import Input from "@/components/universals/forms/Input";
import { AttributeCreateDto } from "@/services/product/attribute.type";
import { createAttribute } from "@/components/apps/product/attribute/AttributeCreateForm.server-action";
import { AttributeType } from "@/services/product/attribute.const";
import Select from "@/components/universals/forms/Select";
import AttributeSettings from './create/AttributeSettings';
import { useRouter } from "next/navigation";
import Fieldset from "@/components/universals/forms/Fieldset.component";
import SimpleFieldsetRow from "@/components/universals/forms/SimpleFieldsetRow.component";

type AttributeCreateFormProps = {
  catalogId: string;
};

const AttributeCreateForm: React.FunctionComponent<AttributeCreateFormProps> = ({
  catalogId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (value: AttributeCreateDto, helpers: FormikHelpers<AttributeCreateDto>) => {
    await createAttribute(catalogId, value);

    router.refresh();
    helpers.resetForm();
  }, [catalogId, router]);

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        attributeTypeId: AttributeType.TEXT,
      }}
    >
      <Form>
        <Fieldset>
          <SimpleFieldsetRow label="Name">
            {(id) => (
              <Input
                id={id}
                name="name"
                type="input"
              />
            )}
          </SimpleFieldsetRow>
          <SimpleFieldsetRow label="Name">
            {(id) => (
              <Select
                id={id}
                name="attributeTypeId"
                values={[{
                  label: 'Text',
                  value: AttributeType.TEXT,
                }, {
                  label: 'Boolean',
                  value: AttributeType.BOOLEAN,
                }, {
                  label: 'JSON',
                  value: AttributeType.JSON,
                }, {
                  label: 'List',
                  value: AttributeType.LIST,
                }, {
                  label: 'Number',
                  value: AttributeType.NUMBER,
                }]}
              />
            )}
          </SimpleFieldsetRow>
          <AttributeSettings/>
          <Button type="submit">
            Erstellen
          </Button>
        </Fieldset>
      </Form>
    </Formik>
  );
};

export default AttributeCreateForm;
