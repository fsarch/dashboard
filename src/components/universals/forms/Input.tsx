import React from 'react';
import { Field } from "formik";

type InputProps = {
  name: string;
  type: 'input' | 'text' | 'password' | 'checkbox' | 'file' | 'number';
  disabled?: boolean;
  required?: boolean;
};

const Input: React.FunctionComponent<InputProps> = ({
  name,
  type,
  disabled,
  required,
}) => {
  return (
    <Field
      type={type}
      name={name}
      disabled={disabled}
      required={required}
    />
  );
};

export default Input;
