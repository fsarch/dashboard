import React, { ChangeEvent, useCallback } from 'react';
import {
  TGeneratedFormImageServerUploadInput,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import { useField } from "formik";

type GeneratedFormImageServerUploadInputProps = {
  input: TGeneratedFormImageServerUploadInput;
};

const toBase64 = (file: File) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    const result = reader.result as string | null;
    if (!result) {
      resolve(null);
      return;
    }

    const dataParts = result.split(',');

    resolve(dataParts[dataParts.length - 1]);
  }
  reader.onerror = reject;
});

const GeneratedFormImageServerUploadInput: React.FunctionComponent<GeneratedFormImageServerUploadInputProps> = ({
  input,
}) => {
  const [, , helper] = useField(input.id);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const updatedValue = {
        $type: 'files',
        files: [{
          type: event.target.files[0].type,
          name: event.target.files[0].name,
          base64: await toBase64(event.target.files[0]),
        }],
      }

      await helper.setValue(updatedValue);
      await helper.setTouched(true);
    }
  }, [helper]);

  return (
    <label
      key={input.id}
    >
      {input.label}
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
      />
    </label>
  );
};

export default GeneratedFormImageServerUploadInput;
