import React from 'react';
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import AutoNavigationItem from "@/components/universals/page/AutoNavigationItem.component";

type AutoNavigationComponentProps = {
  navigation: Array<{
    name: string;
    path: string;
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
      }) => (
        <AutoNavigationItem
          key={name}
          href={await getServiceLocalUrl(path)}
        >
          {name}
        </AutoNavigationItem>
      ))}
    </ul>
  );
};
