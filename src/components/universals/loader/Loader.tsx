import React from 'react';

import styles from './Loader.module.scss';

type LoaderProps = {

};

const Loader: React.FunctionComponent<LoaderProps> = () => {
  return (
    <div className={styles.loader}/>
  );
};

export default Loader;
