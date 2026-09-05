import type { Metadata } from "next";
import styles from './layout.module.scss';
import DialogProvider from "@/components/universals/dialog/DialogProvider.component";
import FloatingButtonProvider from "@/components/universals/floating-button/FloatingButtonProvider.component";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

type LayoutProps = {
  children?: React.ReactNode
}

type LayoutPropsExtended = {
  children?: React.ReactNode
  header: React.ReactNode;
  navigation: React.ReactNode;
}

export default async function RootLayout(props: LayoutProps | LayoutPropsExtended) {
  const {
    children,
    header,
    navigation,
  } = props as LayoutPropsExtended;

  return (
    <FloatingButtonProvider>
      <DialogProvider>
        <div className={styles.root}>
          <div className={styles.header}>
            {header}
          </div>
          <div className={styles.navigation}>
            {navigation}
          </div>
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </DialogProvider>
    </FloatingButtonProvider>
  );
}
