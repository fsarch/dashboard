import React from 'react';
import clsx from 'clsx';
import styles from './ProgressBar.module.scss';

type ProgressBarProps = {
  value: number;
  className?: string;
  label?: string;
};

const ProgressBar: React.FunctionComponent<ProgressBarProps> = ({
  value,
  className,
  label,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx(styles.root, className)}>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={styles.fill}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      <div className={styles.label}>
        {label ?? `${Math.round(clampedValue)}%`}
      </div>
    </div>
  );
};

export default ProgressBar;
