import type React from 'react';
import type { PropsWithChildren } from 'react';
import styles from './AgentsBetaBanner.module.scss';

const AgentsBetaBanner: React.FC<PropsWithChildren> = ({ children }) => (
  <div className={styles.wrapper}>
    <div className={styles.cornerBox}>
      <div className={styles.ribbon}>Beta</div>
    </div>
    {children}
  </div>
);

export default AgentsBetaBanner;
