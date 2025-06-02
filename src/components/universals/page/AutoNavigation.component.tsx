import React from 'react';
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import AutoNavigationItem from "@/components/universals/page/AutoNavigationItem.component";

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
    <ul>
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
