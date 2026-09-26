import clsx from 'clsx';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import styles from './Fieldset.module.scss';

type FieldsetProps = PropsWithChildren<{
  className?: string;
}>;

const Fieldset: React.FunctionComponent<FieldsetProps> = ({
  children,
  className,
}) => {
  return <div className={clsx(styles.root, className)}>{children}</div>;
};

export default Fieldset;
