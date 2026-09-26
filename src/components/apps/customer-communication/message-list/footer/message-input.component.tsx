'use client';

import clsx from 'clsx';
import { useFormikContext } from 'formik';
import type React from 'react';
import MDXInput from '@/components/universals/forms/MDXInput';
import TextArea from '@/components/universals/forms/TextArea';
import { EContentType } from '@/constants/apps/customer-communication/content-type.enum';
import styles from './message-input.module.scss';

type MessageInputProps = {
  className?: string;
};

const MessageInput: React.FunctionComponent<MessageInputProps> = ({
  className,
}) => {
  const { values } = useFormikContext<{ contentType: EContentType }>();

  if (values.contentType === EContentType.TEXT_MARKDOWN) {
    return <MDXInput className={clsx(styles.root, className)} name="content" />;
  }

  return <TextArea className={clsx(styles.root, className)} name="content" />;
};

export default MessageInput;
