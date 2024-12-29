import React from 'react';
import { Field } from "formik";

type InputProps = {
  name: string;
  type: 'input' | 'password' | 'checkbox';
  value?: string;
  disabled?: boolean;
  required?: boolean;
};

const Input: React.FunctionComponent<InputProps> = ({
  name,
  value,
  type,
  disabled,
  required,
}) => {
  return (
    <Field
      type={type}
      name={name}
      value={value}
      disabled={disabled}
      required={required}
    />
  );
};

export default Input;
