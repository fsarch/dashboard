'use client';

import React from 'react';
import { Field } from "formik";
import clsx from "clsx";
import styles from './Input.module.scss';

type TextAreaProps = {
  name: string;
  className?: string;
};

const TextArea: React.FunctionComponent<TextAreaProps> = ({
  name,
  className,
}) => {
  return (
    <Field
      className={clsx(styles.root, styles.textarea, className)}
      as="textarea"
      name={name}
    />
  );
};

export default TextArea;
