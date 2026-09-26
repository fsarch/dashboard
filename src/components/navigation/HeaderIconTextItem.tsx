import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type React from 'react';
import type { PropsWithChildren } from 'react';
import styles from '@/components/navigation/header-icon-text-item.module.scss';

type HeaderIconTextItemProps = PropsWithChildren<{
  icon: IconProp;
}>;

const HeaderIconTextItem: React.FunctionComponent<HeaderIconTextItemProps> = ({
  children,
  icon,
}) => {
  return (
    <div className={styles.root}>
      <FontAwesomeIcon icon={icon} className={styles.icon} />
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default HeaderIconTextItem;
