import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import type React from 'react';
import CommandCenterButton from '@/components/navigation/command-center/CommandCenterButton';
import DevModeSwitch from '@/components/navigation/DevModeSwitch.component';
import EnvironmentSwitcher from '@/components/navigation/EnvironmentSwitcher';
import SignOutIcon from '@/components/navigation/SignOutIcon';
import {
  getEnvironmentSwitcherOptions,
  type TEnvironmentSwitcherConfiguration,
} from '@/utils/configuration.utils';
import { uacUtils } from '@/utils/uac.utils';
import styles from './header.module.scss';

type HeaderProps = {
  title: string;
  // See DefaultPageHeader - undefined means "look it up for the current
  // (single) service myself", explicit null/value overrides that lookup.
  environmentSwitcherConfiguration?: TEnvironmentSwitcherConfiguration | null;
};

const Header: React.FunctionComponent<HeaderProps> = async ({
  title,
  environmentSwitcherConfiguration: environmentSwitcherConfigurationOverride,
}) => {
  const isDeveloper = await uacUtils.hasPermission('dev');
  const environmentSwitcherConfiguration =
    environmentSwitcherConfigurationOverride !== undefined
      ? environmentSwitcherConfigurationOverride
      : await getEnvironmentSwitcherOptions();

  return (
    <div className={styles.root}>
      <Link href="/" className={styles.iconWrapper}>
        <FontAwesomeIcon icon={faHome} className={styles.icon} />
      </Link>
      <div className={styles.visibleSpacer} />
      <CommandCenterButton />
      <div className={styles.visibleSpacer} />
      <div className={styles.title}>{title}</div>
      {environmentSwitcherConfiguration && (
        <div className={styles.environmentSwitcherWrapper}>
          <EnvironmentSwitcher
            configuration={environmentSwitcherConfiguration}
            variant="plain"
          />
        </div>
      )}
      {isDeveloper && (
        <div className={styles.iconWrapper}>
          <DevModeSwitch />
        </div>
      )}
      <div className={styles.iconWrapper}>
        <SignOutIcon className={styles.iconLogout} />
      </div>
    </div>
  );
};

export default Header;
