import React from 'react';
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import TileList from "@/components/universals/tile-list/TileList";
import { AppNavigationItem } from "@/constants/app.type";
import LinkTileListItem from "@/components/universals/tile-list/LinkTileListItem";

type NavigationTileListProps = {
  navigation: Array<AppNavigationItem>;
};

const NavigationTileList: React.FunctionComponent<NavigationTileListProps> = async ({
  navigation,
}) => {
  return (
    <TileList>
      {navigation.map(async (navigationItem, index) => (
        <LinkTileListItem
          key={index}
          href={await getServiceLocalUrl(navigationItem.path as string)}
          name={navigationItem.name}
          icon={navigationItem.icon}
        />
      ))}
    </TileList>
  );
};

export default NavigationTileList;
