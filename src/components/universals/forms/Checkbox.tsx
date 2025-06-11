'use client';

import React from 'react';
import { Field } from "formik";

type CheckboxProps = {
  name: string;
  disabled?: boolean;
  required?: boolean;
  value: string;
};

const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  name,
  disabled,
  required,
  value,
}) => {
  return (
    <Field
      type="checkbox"
      value={value}
      name={name}
      disabled={disabled}
      required={required}
    />
  );
};

export default Checkbox;
