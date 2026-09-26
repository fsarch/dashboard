'use client';

import { Field } from 'formik';
import type React from 'react';

type CheckboxProps = {
  id?: string;
  name: string;
  disabled?: boolean;
  required?: boolean;
  value?: string;
};

const Checkbox: React.FunctionComponent<CheckboxProps> = ({
  id,
  name,
  disabled,
  required,
  value,
}) => {
  return (
    <Field
      id={id}
      type="checkbox"
      value={value}
      name={name}
      disabled={disabled}
      required={required}
    />
  );
};

export default Checkbox;
