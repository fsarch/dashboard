import React from 'react';
import { Field } from "formik";
import styles from './Select.module.scss';

type SelectProps = {
  id?: string;
  name: string;
  values: Array<{ id?: string; value: string; label: string; }>
};

const Select: React.FunctionComponent<SelectProps> = ({
  id,
  name,
  values,
}) => {
  return (
    <Field
      id={id}
      className={styles.input}
      as="select"
      name={name}
    >
      {values.map((value) => (
        <option key={value.id ?? value.value} value={value.value}>{value.label}</option>
      ))}
    </Field>
  );
};

export default Select;
