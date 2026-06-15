import React from 'react';
import { Field } from "formik";
import styles from './Select.module.scss';
import clsx from "clsx";

type SelectProps = {
  id?: string;
  name: string;
  values: Array<{ id?: string; value: string; label: string; }>;
  disabled?: boolean;
  className?: string;
};

const Select: React.FunctionComponent<SelectProps> = ({
  id,
  name,
  values,
  disabled,
  className,
}) => {
  return (
    <Field
      id={id}
      className={clsx(className, styles.input)}
      as="select"
      name={name}
      disabled={disabled}
    >
      {values.map((value) => (
        <option key={value.id ?? value.value} value={value.value}>{value.label}</option>
      ))}
    </Field>
  );
};

export default Select;
