import React, { CSSProperties } from 'react';

import styles from './Loader.module.scss';

type LoaderProps = {
  size?: number;
};

const Loader: React.FunctionComponent<LoaderProps> = ({
  size = 48,
}) => {
  return (
    <div
      style={{
        '--size': `${size}px`,
      } as CSSProperties}
      className={styles.loader}
    />
  );
};

export default Loader;
