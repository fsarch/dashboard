'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import AttributeSettings from '@/components/apps/product/attribute/create/AttributeSettings';
import { createLocalization } from '@/components/apps/product/localization/LocalizationCreateForm.server-action';
import Button from '@/components/universals/forms/Button';
import Input from '@/components/universals/forms/Input';
import Select from '@/components/universals/forms/Select';
import { AttributeType } from '@/services/product/attribute.const';
import {
  CountryCode,
  LanguageCode,
} from '@/services/product/localization.const';
import type { LocalizationCreateDto } from '@/services/product/localization.type';

type LocalizationCreateFromProps = {
  catalogId: string;
};

const LocalizationCreateForm: React.FunctionComponent<
  LocalizationCreateFromProps
> = ({ catalogId }) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      value: LocalizationCreateDto,
      helpers: FormikHelpers<LocalizationCreateDto>,
    ) => {
      await createLocalization(value);

      router.refresh();
      helpers.resetForm();
    },
    [router],
  );

  return (
    <Formik
      onSubmit={handleSubmit}
      initialValues={{
        name: '',
        countryCode: 'DE',
        languageCode: 'de',
      }}
    >
      <Form>
        <Input name="name" type="input" />

        <Select
          name="countryCode"
          values={[
            {
              label: 'Deutschland',
              value: CountryCode.GERMANY,
            },
            {
              label: 'England',
              value: CountryCode.ENGLAND,
            },
          ]}
        />
        <Select
          name="languageCode"
          values={[
            {
              label: 'Deutsch',
              value: LanguageCode.GERMAN,
            },
            {
              label: 'Englisch',
              value: LanguageCode.ENGLISH,
            },
          ]}
        />
        <AttributeSettings catalogId={catalogId} />
        <Button type="submit">Erstellen</Button>
      </Form>
    </Formik>
  );
};

export default LocalizationCreateForm;
