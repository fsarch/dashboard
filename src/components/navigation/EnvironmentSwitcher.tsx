'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { setSelectedEnvironment } from '@/components/navigation/EnvironmentSwitcher.server-action';
import type { TEnvironmentSwitcherConfiguration } from '@/utils/configuration.utils';
import styles from './EnvironmentSwitcher.module.scss';

type EnvironmentSwitcherProps = {
  configuration: TEnvironmentSwitcherConfiguration;
  // "plain" drops the select's own border/radius - for when it's already
  // sitting inside its own container (see the dashboard home page's pill),
  // where that chrome would just double up. Defaults to the bordered look
  // used in the Topbar.
  variant?: 'default' | 'plain';
};

const EnvironmentSwitcher: React.FunctionComponent<
  EnvironmentSwitcherProps
> = ({ configuration, variant = 'default' }) => {
  const router = useRouter();

  const handleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const option = configuration.options.find(
      (o) => o.id === event.target.value,
    );
    if (option) {
      // Persisted so it's picked up everywhere else too - other app types'
      // ServiceSelectionPage, and this same select shown there or on the
      // next single-service page you visit.
      await setSelectedEnvironment(option.id);
      router.push(option.href);
      // Covers navigating to the page we're already on (e.g. the dashboard
      // home page filtering its own "Custom Apps" list) - push alone won't
      // re-run server components for an unchanged pathname.
      router.refresh();
    }
  };

  return (
    <div className={styles.wrapper}>
      <select
        className={clsx(
          styles.select,
          variant === 'plain' && styles.selectPlain,
        )}
        value={configuration.currentEnvironmentId}
        onChange={handleChange}
        title="Environment"
      >
        {configuration.options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {/* Native <select> can't render ::after itself, and a background-image
          arrow can't pick up currentColor across light/dark contexts - a
          plain CSS-triangle overlay can, and stays out of the select's own
          click handling via pointer-events: none. */}
      <span className={styles.arrow} aria-hidden="true" />
    </div>
  );
};

export default EnvironmentSwitcher;
