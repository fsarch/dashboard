'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import Button from '@/components/universals/forms/Button';
import Select from '@/components/universals/forms/Select';
import { patchImageVisibility } from './PatchImageVisibility.server-action';

type PatchImageVisibilityFormProps = {
  imageId: string;
  currentVisibility: boolean;
  serviceId: string;
};

type FormData = {
  visibility: string;
};

const PatchImageVisibilityForm: React.FunctionComponent<
  PatchImageVisibilityFormProps
> = ({ imageId, currentVisibility, serviceId }) => {
  const router = useRouter();

  const handleSubmit = useCallback(
    async (data: FormData, helpers: FormikHelpers<FormData>) => {
      await patchImageVisibility(imageId, data.visibility === 'public');
      router.refresh();
      helpers.setSubmitting(false);
    },
    [imageId, router],
  );

  return (
    <Formik
      initialValues={{
        visibility: currentVisibility ? 'public' : 'private',
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <Select
          name="visibility"
          values={[
            { value: 'public', label: 'Öffentlich' },
            { value: 'private', label: 'Privat' },
          ]}
        />
        <Button type="submit">Visibility speichern</Button>
      </Form>
    </Formik>
  );
};

export default PatchImageVisibilityForm;
