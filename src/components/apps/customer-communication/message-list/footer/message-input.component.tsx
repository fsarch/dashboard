'use client';

import React from 'react';
import TextArea from "@/components/universals/forms/TextArea";
import { useFormikContext } from "formik";
import MDXInput from "@/components/universals/forms/MDXInput";

import styles from './message-input.module.scss';
import clsx from "clsx";

type MessageInputProps = {
  className?: string;
};

const MessageInput: React.FunctionComponent<MessageInputProps> = ({
  className,
}) => {
  const { values } = useFormikContext<{ contentType: string; }>();

  if (values.contentType === 'markdown') {
    return (
      <MDXInput
        className={clsx(styles.root, className)}
        name="content"
      />
    );
  }

  return (
    <TextArea
      className={clsx(styles.root, className)}
      name="content"
    />
  );
};

export default MessageInput;
