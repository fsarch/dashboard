import type React from 'react';
import type { AutoNavigationItemType } from '@/components/universals/page/AutoNavigation.type';
import AutoNavigationItem from '@/components/universals/page/AutoNavigationItem.component';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';
import styles from './AutoNavigation.module.scss';

type AutoNavigationComponentProps = {
  items?: Array<AutoNavigationItemType>;
  bottomItems?: Array<AutoNavigationItemType>;
};

export const AutoNavigation: React.FunctionComponent<
  AutoNavigationComponentProps
> = async ({ items, bottomItems }) => {
  return (
    <div className={styles.root}>
      <ul className={styles.main}>
        {items?.map(async ({ name, path, isSelected, icon }) => (
          <AutoNavigationItem
            key={name}
            isSelected={isSelected}
            href={await getServiceLocalUrl(path)}
            icon={icon}
          >
            {name}
          </AutoNavigationItem>
        ))}
      </ul>
      <div className={styles.spacer} />
      <ul className={styles.bottom}>
        {bottomItems?.map(async ({ name, path, isSelected, icon }) => (
          <AutoNavigationItem
            key={name}
            isSelected={isSelected}
            href={await getServiceLocalUrl(path)}
            icon={icon}
          >
            {name}
          </AutoNavigationItem>
        ))}
      </ul>
    </div>
  );
};
