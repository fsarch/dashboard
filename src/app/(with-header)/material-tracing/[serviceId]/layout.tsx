import type { PropsWithChildren } from 'react';
import ShortCodeScanFloatingButtonListener from '@/components/apps/material-tracing/floating-button/ShortCodeScanFloatingButtonListener.component';
import styles from './layout.module.scss';

export default async function RootLayout(props: PropsWithChildren) {
  const { children } = props;

  return (
    <div className={styles.root}>
      {children}
      <ShortCodeScanFloatingButtonListener />
    </div>
  );
}
