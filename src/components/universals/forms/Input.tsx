import clsx from 'clsx';
import { Field } from 'formik';
import type React from 'react';
import styles from './Input.module.scss';

type InputProps = {
  id?: string;
  name: string;
  type:
    | 'input'
    | 'text'
    | 'password'
    | 'checkbox'
    | 'file'
    | 'number'
    | 'time'
    | 'url'
    | 'datetime-local';
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  value?: string;
  className?: string;
  placeholder?: string;
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
  placeholder,
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
      placeholder={placeholder}
    />
  );
};

export default Input;
