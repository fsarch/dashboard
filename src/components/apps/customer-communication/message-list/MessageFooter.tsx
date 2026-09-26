'use client';

import { Form, Formik, type FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useCallback } from 'react';
import MarkdownHint from '@/components/apps/customer-communication/message-list/footer/markdown-hint.component';
import MessageInput from '@/components/apps/customer-communication/message-list/footer/message-input.component';
import { sendMessage } from '@/components/apps/customer-communication/message-list/message-footer.server-action';
import Button from '@/components/universals/forms/Button';
import { EContentType } from '@/constants/apps/customer-communication/content-type.enum';
import { useCurrentServiceId } from '@/utils/hooks/useCurrentServiceId.hook';
import styles from './message-footer.module.scss';

type MessageFooterProps = {
  threadId: string;
};

type MessageFooterValues = {
  content: string;
  contentType: EContentType;
};

const MessageFooter: React.FunctionComponent<MessageFooterProps> = ({
  threadId,
}) => {
  const serviceId = useCurrentServiceId();

  const router = useRouter();

  const handleSubmit = useCallback(
    async (
      values: MessageFooterValues,
      helpers: FormikHelpers<MessageFooterValues>,
    ) => {
      await sendMessage(serviceId, threadId, values);

      helpers.resetForm();

      router.refresh();
    },
    [serviceId, threadId, router],
  );

  return (
    <Formik
      initialValues={{
        content: '',
        contentType: EContentType.TEXT_PLAIN,
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <MessageInput className={styles.input} />
            <Button className={styles.submit} type="submit">
              Senden
            </Button>
          </div>
          <MarkdownHint name="contentType" value={EContentType.TEXT_MARKDOWN} />
        </div>
      </Form>
    </Formik>
  );
};

export default MessageFooter;
