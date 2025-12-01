'use client';

import React from 'react';
import { useField } from "formik";
import FileInput from "@/components/universals/forms/FileInput";

type ImageInputProps = {
  name: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  capture?: 'user' | 'environment';
  imageServerUrl: string;
};

export const ImageInput: React.FunctionComponent<ImageInputProps> = ({
  name,
  className,
  disabled,
  required,
  multiple,
  capture,
}) => {
  const [field, meta, helpers] = useField(name);

  return (
    <FileInput
      className={className}
      name={name}
      disabled={disabled}
      required={required}
      multiple={multiple}
      capture={capture}
    />
  );
};
