'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCurrentServiceId } from "@/utils/hooks/useCurrentServiceId.hook";
import styles from './markdown-content.module.scss';

type MarkdownContentProps = {
  threadId: string;
  messageId: string;
};

const MarkdownContent: React.FunctionComponent<MarkdownContentProps> = ({
  threadId,
  messageId,
}) => {
  const serviceId = useCurrentServiceId();
  const ref = useRef<HTMLIFrameElement | null>(null);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.source !== ref.current?.contentWindow) {
        return;
      }

      if (event.data.type !== 'resize') {
        return;
      }

      console.log('update height', event.data.payload)
      setHeight(event.data.payload);
    };
    window.addEventListener('message', handler);

    return () => {
      window.removeEventListener('message', handler);
    };
  }, [ref]);

  console.log('height', height);

  return (
    <iframe
      style={{
        height,
      }}
      ref={ref}
      src={`/ccm/${serviceId}/threads/${threadId}/messages/${messageId}/embed`}
      sandbox="allow-scripts"
      className={styles.root}
    />
  );
};

export default MarkdownContent;
