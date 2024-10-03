import type { Metadata } from "next";
import styles from './layout.module.scss';

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

type LayoutProps = {
  children?: React.ReactNode
}

type LayoutPropsExtended = {
  children?: React.ReactNode
  header: React.ReactNode;
}

export default async function RootLayout(props: LayoutProps | LayoutPropsExtended) {
  const {
    children,
    header,
  } = props as LayoutPropsExtended;

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        {header}
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}
