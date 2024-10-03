'use client';

import React from 'react';
import TextArea from "@/components/universals/forms/TextArea";
import { useFormikContext } from "formik";
import MDXInput from "@/components/universals/forms/MDXInput";

import styles from './message-input.module.scss';
import clsx from "clsx";
import { EContentType } from "@/constants/apps/customer-communication/content-type.enum";

type MessageInputProps = {
  className?: string;
};

const MessageInput: React.FunctionComponent<MessageInputProps> = ({
  className,
}) => {
  const { values } = useFormikContext<{ contentType: EContentType; }>();

  if (values.contentType === EContentType.TEXT_MARKDOWN) {
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
