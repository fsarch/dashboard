'use client';

import React from 'react';
import { Field } from "formik";

type TextAreaProps = {
  name: string;
  className?: string;
};

const TextArea: React.FunctionComponent<TextAreaProps> = ({
  name,
  className,
}) => {
  return (
    <Field
      className={className}
      as="textarea"
      name={name}
    />
  );
};

export default TextArea;
