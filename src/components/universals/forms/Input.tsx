import React from 'react';
import { Field } from "formik";

type InputProps = {
  name: string;
  type: 'input' | 'password' | 'checkbox';
  value?: string;
  disabled?: boolean;
};

const Input: React.FunctionComponent<InputProps> = ({
  name,
  value,
  type,
  disabled,
}) => {
  return (
    <Field
      type={type}
      name={name}
      value={value}
      disabled={disabled}
    />
  );
};

export default Input;
