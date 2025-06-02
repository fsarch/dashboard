import React from 'react';
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import AutoNavigationItem from "@/components/universals/page/AutoNavigationItem.component";
import styles from './AutoNavigation.module.scss';

type AutoNavigationComponentProps = {
  navigation: Array<{
    name: string;
    path: string;
    isSelected: boolean;
  }>
};

export const AutoNavigation: React.FunctionComponent<AutoNavigationComponentProps> = async ({
  navigation,
}) => {
  return (
    <ul className={styles.root}>
      {navigation.map(async ({
        name,
        path,
        isSelected,
      }) => (
        <AutoNavigationItem
          key={name}
          isSelected={isSelected}
          href={await getServiceLocalUrl(path)}
        >
          {name}
        </AutoNavigationItem>
      ))}
    </ul>
  );
};
