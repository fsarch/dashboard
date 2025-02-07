import React, { ChangeEvent, useCallback } from 'react';
import { Field, useField } from "formik";

type FileInputProps = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
};

const FileInput: React.FunctionComponent<FileInputProps> = ({
  name,
  disabled,
  required,
  multiple,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (multiple) {
      helpers.setValue(files);
    } else {
      helpers.setValue(files[0]);
    }
  }, [helpers, multiple]);

  return (
    <input
      type="file"
      name=""
      disabled={disabled}
      required={required}
      onChange={handleChange}
      multiple={multiple}
    />
  );
};

export default FileInput;
