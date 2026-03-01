import React from 'react';
import { Field } from "formik";
import styles from './Input.module.scss';
import clsx from "clsx";

type InputProps = {
  id?: string;
  name: string;
  type: 'input' | 'text' | 'password' | 'checkbox' | 'file' | 'number' | 'time' | 'url';
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: string;
  className?: string;
};

const Input: React.FunctionComponent<InputProps> = ({
  id,
  name,
  type,
  disabled,
  required,
  min,
  max,
  step,
  className,
}) => {
  return (
    <Field
      className={clsx(styles.root, className)}
      id={id}
      type={type}
      name={name}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
    />
  );
};

export default Input;
