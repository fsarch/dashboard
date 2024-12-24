import React from 'react';
import { Field } from "formik";

type InputProps = {
  name: string;
  type: 'input' | 'password';
  disabled?: boolean;
};

const Input: React.FunctionComponent<InputProps> = ({
  name,
  type,
  disabled,
}) => {
  return (
    <Field
      type={type}
      name={name}
      disabled={disabled}
    />
  );
};

export default Input;
