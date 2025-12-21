import type { PropsWithChildren } from "react";
import ShortCodeScanFloatingButton
  from "@/app/(with-header)/material-tracing/[serviceId]/_components/floating-button/ShortCodeScanFloatingButton";
import styles from './layout.module.scss';

export default async function RootLayout(props: PropsWithChildren) {
  const {
    children,
  } = props;

  return (
    <div className={styles.root}>
      {children}
      <ShortCodeScanFloatingButton />
    </div>
  );
}
