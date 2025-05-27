import React from 'react';
import { Field } from "formik";
import styles from './Input.module.scss';

type InputProps = {
  id?: string;
  name: string;
  type: 'input' | 'text' | 'password' | 'checkbox' | 'file' | 'number';
  disabled?: boolean;
  required?: boolean;
};

const Input: React.FunctionComponent<InputProps> = ({
  id,
  name,
  type,
  disabled,
  required,
}) => {
  return (
    <Field
      className={styles.root}
      id={id}
      type={type}
      name={name}
      disabled={disabled}
      required={required}
    />
  );
};

export default Input;
