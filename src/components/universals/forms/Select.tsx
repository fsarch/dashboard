import React from 'react';
import { Field } from "formik";

type SelectProps = {
  name: string;
  values: Array<{ value: string; label: string; }>
};

const Select: React.FunctionComponent<SelectProps> = ({
  name,
  values,
}) => {
  return (
    <Field as="select" name={name}>
      {values.map((value) => (
        <option key={value.value} value={value.value}>{value.label}</option>
      ))}
    </Field>
  );
};

export default Select;
