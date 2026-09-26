import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type React from 'react';
import * as sanitizeHtml from 'sanitize-html';
import styles from './html.module.scss';

type HtmlProps = {
  content: string;
};

const Html: React.FunctionComponent<HtmlProps> = ({ content }) => {
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
