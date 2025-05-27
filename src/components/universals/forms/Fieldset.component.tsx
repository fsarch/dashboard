import React, { PropsWithChildren } from 'react';

import styles from './Fieldset.module.scss';

type FieldsetProps = PropsWithChildren<{

}>;

const Fieldset: React.FunctionComponent<FieldsetProps> = ({
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
    </div>
  );
};

export default Fieldset;
