import type { PropsWithChildren } from "react";
import styles from './layout.module.scss';
import ShortCodeScanFloatingButtonListener
  from "@/components/apps/material-tracing/floating-button/ShortCodeScanFloatingButtonListener.component";

export default async function RootLayout(props: PropsWithChildren) {
  const {
    children,
  } = props;

  return (
    <div className={styles.root}>
      {children}
      <ShortCodeScanFloatingButtonListener />
    </div>
  );
}
