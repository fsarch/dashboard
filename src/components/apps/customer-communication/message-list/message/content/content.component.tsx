import React from 'react';
import { EContentType } from "@/constants/apps/customer-communication/content-type.enum";
import PlainTextContent
  from "@/components/apps/customer-communication/message-list/message/content/plain-text-content.component";
import MarkdownContent
  from "@/components/apps/customer-communication/message-list/message/content/markdown-content.component";
import styles from './content.module.scss';

type ContentProps = {
  content: string;
  contentType: EContentType;
  threadId: string;
  messageId: string;
};

const Content: React.FunctionComponent<ContentProps> = ({
  contentType,
  content,
  threadId,
  messageId,
}) => {
  if (contentType === EContentType.TEXT_PLAIN) {
    return <PlainTextContent value={content}/>
  }

  if (contentType === EContentType.TEXT_MARKDOWN) {
    return <MarkdownContent threadId={threadId} messageId={messageId} />
  }

  if (contentType === EContentType.TEXT_HTML) {
    return <MarkdownContent className={styles.htmlContent} threadId={threadId} messageId={messageId} />
  }

  return (
    <div>
      Unsupported ContentType: {contentType}
    </div>
  );
};

export default Content;
