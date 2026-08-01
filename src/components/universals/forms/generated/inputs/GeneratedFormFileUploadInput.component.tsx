import React, { ChangeEvent, useCallback, useId } from 'react';
import {
  TGeneratedFormFileUploadInput,
} from "@/components/universals/forms/generated/GeneratedForm.type";
import { useField } from "formik";
import FieldsetRow from "@/components/universals/forms/FieldsetRow.component";

type GeneratedFormFileUploadInputProps = {
  input: TGeneratedFormFileUploadInput;
};

const toBase64 = (file: File) => new Promise<string | null>((resolve) => {
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
  };
  reader.onerror = () => resolve(null);
});

const GeneratedFormFileUploadInput: React.FunctionComponent<GeneratedFormFileUploadInputProps> = ({
  input,
}) => {
  const id = useId();

  const [, , helper] = useField(input.id);

  const handleFileChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      await helper.setValue(null);
      return;
    }

    const fileData = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        type: file.type || 'application/octet-stream',
        base64: await toBase64(file),
        size: file.size,
      }))
    );

    await helper.setValue({
      $type: 'files',
      files: fileData.filter((f) => f.base64 !== null),
    });
    await helper.setTouched(true);
  }, [helper]);

  return (
    <FieldsetRow
      label={
        <label htmlFor={id}>{input.label}</label>
      }
    >
      <input
        type="file"
        id={id}
        onChange={handleFileChange}
        accept={input.accept}
        multiple={input.multiple}
        capture={input.capture}
      />
    </FieldsetRow>
  );
};

export default GeneratedFormFileUploadInput;
