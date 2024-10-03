import React from 'react';
import styles from './html.module.scss';

type HtmlProps = {
  content: string;
};

const Html: React.FunctionComponent<HtmlProps> = ({
  content,
}) => {
  return (
    <div
      className={styles.root}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default Html;
