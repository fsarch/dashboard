'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import { createAttribute } from '@/components/apps/product/attribute/AttributeCreateForm.server-action';
import FormikSubmitButton from '@/components/universals/forms/button/FormikSubmitButton';
import Fieldset from '@/components/universals/forms/Fieldset.component';
import Input from '@/components/universals/forms/Input';
import Select from '@/components/universals/forms/Select';
import SimpleFieldsetRow from '@/components/universals/forms/SimpleFieldsetRow.component';
import { AttributeType } from '@/services/product/attribute.const';
import type { AttributeCreateDto } from '@/services/product/attribute.type';
import AttributeSettings from './create/AttributeSettings';

type AttributeCreateFormProps = {
  catalogId: string;
};

const AttributeCreateForm: React.FunctionComponent<
  AttributeCreateFormProps
> = ({ catalogId }) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      value: AttributeCreateDto,
      helpers: FormikHelpers<AttributeCreateDto>,
    ) => {
      console.log('submit value', value);
      await createAttribute(catalogId, value);

      router.refresh();
      helpers.resetForm();
    },
    [catalogId, router],
  );

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
            {(id) => <Input id={id} name="name" type="input" />}
          </SimpleFieldsetRow>
          <SimpleFieldsetRow label="Name">
            {(id) => (
              <Select
                id={id}
                name="attributeTypeId"
                values={[
                  {
                    label: 'Text',
                    value: AttributeType.TEXT,
                  },
                  {
                    label: 'Boolean',
                    value: AttributeType.BOOLEAN,
                  },
                  {
                    label: 'JSON',
                    value: AttributeType.JSON,
                  },
                  {
                    label: 'List',
                    value: AttributeType.LIST,
                  },
                  {
                    label: 'Number',
                    value: AttributeType.NUMBER,
                  },
                  {
                    label: 'Link',
                    value: AttributeType.LINK,
                  },
                  {
                    label: 'Image',
                    value: AttributeType.IMAGE,
                  },
                ]}
              />
            )}
          </SimpleFieldsetRow>
          <AttributeSettings catalogId={catalogId} />
          <FormikSubmitButton>Erstellen</FormikSubmitButton>
        </Fieldset>
      </Form>
    </Formik>
  );
};

export default AttributeCreateForm;
