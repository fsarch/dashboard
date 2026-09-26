import { Field, useField } from 'formik';
import type React from 'react';
import { type ChangeEvent, useCallback } from 'react';

type FileInputProps = {
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  capture?: 'user' | 'environment';
  accept?: string;
};

const FileInput: React.FunctionComponent<FileInputProps> = ({
  className,
  name,
  disabled,
  required,
  multiple,
  capture,
  accept,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files ?? []);

      if (multiple) {
        helpers.setValue(files);
      } else {
        helpers.setValue(files[0]);
      }
    },
    [helpers, multiple],
  );

  return (
    <input
      type="file"
      name=""
      accept={accept}
      className={className}
      disabled={disabled}
      required={required}
      onChange={handleChange}
      multiple={multiple}
      capture={capture}
    />
  );
};

export default FileInput;
