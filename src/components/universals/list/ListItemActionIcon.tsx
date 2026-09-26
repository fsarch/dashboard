import type React from 'react';
import { type MouseEventHandler, useCallback } from 'react';
import Icon from '@/components/universals/icon/Icon.component';
import type { TIcon } from '@/components/universals/icon/Icon.type';
import styles from './ListItemActionIcon.module.scss';

type ListItemActionIconProps = {
  icon: TIcon;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

const ListItemActionIcon: React.FunctionComponent<ListItemActionIconProps> = ({
  icon,
  onClick,
}) => {
  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      event.preventDefault();

      if (onClick) {
        onClick(event);
      }
    },
    [onClick],
  );

  return (
    <button type="button" onClick={handleClick} className={styles.root}>
      <Icon icon={icon} />
    </button>
  );
};

export default ListItemActionIcon;
