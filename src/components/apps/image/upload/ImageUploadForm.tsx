'use client'

import React, { useCallback } from 'react';
import Section from "@/components/universals/section/Section";
import { Form, Formik, FormikHelpers } from "formik";
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import FileInput from "@/components/universals/forms/FileInput";
import { uploadImage } from "@/components/apps/image/upload/ImageUploadForm.server-action";
import { useRouter } from "next/navigation";

type ImageUploadFormProps = {
  serviceId: string;
};

const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = reject;
});

type ImageUploadFormDataType = { name: string; file: File | null };

const ImageUploadForm: React.FunctionComponent<ImageUploadFormProps> = ({
  serviceId,
}) => {
  const router = useRouter();

  const handleUpload = useCallback(async (data: ImageUploadFormDataType, helpers: FormikHelpers<ImageUploadFormDataType>) => {
    if (!data.file) {
      return;
    }

    await uploadImage({
      name: data.name,
      base64: (await toBase64(data.file)).split(',').pop() as string,
    });

    router.refresh();
    helpers.resetForm();
  }, [router]);

  return (
    <Section
      name="Bild hochladen"
    >
      <Formik
        initialValues={{
          name: '',
          file: null as File | null,
        }}
        onSubmit={handleUpload}
      >
        <Form>
          <Input type="text" name="name" />
          <FileInput name="file" />
          <Button type="submit">
            Hochladen
          </Button>
        </Form>
      </Formik>
    </Section>
  );
};

export default ImageUploadForm;
