import React, { PropsWithChildren } from 'react';

import styles from './Fieldset.module.scss';
import clsx from "clsx";

type FieldsetProps = PropsWithChildren<{
  className?: string;
}>;

const Fieldset: React.FunctionComponent<FieldsetProps> = ({
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
      {children}
    </div>
  );
};

export default Fieldset;
