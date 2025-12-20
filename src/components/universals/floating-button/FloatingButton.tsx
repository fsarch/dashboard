import React, { MouseEventHandler } from 'react';
import styles from './FloatingButton.module.scss';
import Icon from "@/components/universals/icon/Icon.component";
import type { TIcon } from "@/components/universals/icon/Icon.type";

type FloatingButtonProps = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  icon: TIcon;
};

const FloatingButton: React.FunctionComponent<FloatingButtonProps> = ({
  onClick,
  icon,
}) => {
  return (
    <button
      type="button"
      className={styles.root}
      onClick={onClick}
    >
      <Icon
        className={styles.icon}
        icon={icon}
      />
    </button>
  );
};

export default FloatingButton;
