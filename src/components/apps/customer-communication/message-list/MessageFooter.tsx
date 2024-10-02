'use client';

import React, { useCallback } from 'react';
import TextArea from "@/components/universals/forms/TextArea";
import { Form, Formik } from "formik";
import Button from "@/components/universals/forms/Button";

import styles from './message-footer.module.scss';
import MarkdownHint from "@/components/apps/customer-communication/message-list/footer/markdown-hint.component";
import MessageInput from "@/components/apps/customer-communication/message-list/footer/message-input.component";

type MessageFooterProps = {

};

const MessageFooter: React.FunctionComponent<MessageFooterProps> = () => {
  const handleSubmit = useCallback(() => {
    console.log('submit');
  }, []);

  return (
    <Formik
      initialValues={{
        content: '',
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div className={styles.wrapper}>
          <div className={styles.inputWrapper}>
            <MessageInput
              className={styles.input}
            />
            <Button
              className={styles.submit}
              type="submit"
            >
              Senden
            </Button>
          </div>
          <MarkdownHint
            name="contentType"
            value="markdown"
          />
        </div>
      </Form>
    </Formik>
  );
};

export default MessageFooter;
