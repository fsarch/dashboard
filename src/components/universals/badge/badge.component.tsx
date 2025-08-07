import React, { CSSProperties, PropsWithChildren, useMemo } from 'react';
import styles from './badge.module.scss';
import Color from "color";

type BadgeProps = PropsWithChildren<{
  color?: string;
}>;

const Badge: React.FunctionComponent<BadgeProps> = ({
  children,
  color,
}) => {
  const style = useMemo((): CSSProperties => {
    if (!color) {
      return {};
    }

    const textColor = Color(color).isLight() ? '#000000' : '#FFFFFF';

    return {
      '--color': color,
      '--text-color': textColor,
    } as CSSProperties;
  }, [color]);

  return (
    <div
      className={styles.root}
      style={style}
    >
      {children}
    </div>
  );
};

export default Badge;
