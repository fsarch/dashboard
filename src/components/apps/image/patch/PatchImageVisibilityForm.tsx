'use client';

import React, { useCallback } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import Select from '@/components/universals/forms/Select';
import Button from '@/components/universals/forms/Button';
import { patchImageVisibility } from './PatchImageVisibility.server-action';
import { useRouter } from 'next/navigation';

type PatchImageVisibilityFormProps = {
  imageId: string;
  currentVisibility: boolean;
  serviceId: string;
};

type FormData = {
  visibility: string;
};

const PatchImageVisibilityForm: React.FunctionComponent<PatchImageVisibilityFormProps> = ({
  imageId,
  currentVisibility,
  serviceId,
}) => {
  const router = useRouter();

  const handleSubmit = useCallback(async (data: FormData, helpers: FormikHelpers<FormData>) => {
    await patchImageVisibility(imageId, data.visibility === 'public');
    router.refresh();
    helpers.setSubmitting(false);
  }, [imageId, router]);

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
        <Button type="submit">
          Visibility speichern
        </Button>
      </Form>
    </Formik>
  );
};

export default PatchImageVisibilityForm;
