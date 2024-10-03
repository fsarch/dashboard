import React from 'react';
import styles from './html.module.scss';

import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';
import * as sanitizeHtml from 'sanitize-html';

type HtmlProps = {
  content: string;
};

const Html: React.FunctionComponent<HtmlProps> = ({
  content,
}) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const cleanContent = purify.sanitize(content);
  const cleanCleanContent = sanitizeHtml.default(cleanContent);

  return (
    <div
      className={styles.root}
      dangerouslySetInnerHTML={{ __html: cleanCleanContent }}
    />
  );
};

export default Html;
