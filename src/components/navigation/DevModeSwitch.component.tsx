'use client';

import React, { useState, useEffect } from 'react';
import { toggleDevMode, getDevMode } from '@/components/navigation/DevModeSwitch.server-action';
import styles from './DevModeSwitch.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBug } from '@fortawesome/free-solid-svg-icons';
import clsx from "clsx";
import Loader from "@/components/universals/loader/Loader";

type DevModeSwitchProps = {
  className?: string;
};

const DevModeSwitch: React.FunctionComponent<DevModeSwitchProps> = ({
  className,
}) => {
  const [enabled, setEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDevMode = async () => {
      try {
        const isEnabled = await getDevMode();
        setEnabled(isEnabled);
      } catch {
        setEnabled(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDevMode();
  }, []);

  const handleToggle = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    await toggleDevMode(newEnabled);
  };

  return (
    <label className={styles.root}>
      {isLoading ? (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader}>
            <Loader size={24} />
          </div>
        </div>
      ) : null}
      <FontAwesomeIcon icon={faBug} className={clsx(styles.icon, enabled && styles.iconEnabled )}/>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={!isLoading ? handleToggle : undefined}
        className={`${styles.switch} ${enabled ? styles.enabled : ''} ${className || ''}`}
        title="Dev Mode"
      >
        <span className={styles.thumb} />
      </button>
    </label>
  );
};

export default DevModeSwitch;
