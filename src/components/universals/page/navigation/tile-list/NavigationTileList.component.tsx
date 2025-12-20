import React from 'react';
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import TileList from "@/components/universals/tile-list/TileList";
import { AppNavigationItem } from "@/constants/app.type";

type NavigationTileListProps = {
  navigation: Array<AppNavigationItem>;
};

const NavigationTileList: React.FunctionComponent<NavigationTileListProps> = async ({
  navigation,
}) => {
  return (
    <TileList>
      {navigation.map(async (navigationItem, index) => (
        <Link
          key={index}
          href={await getServiceLocalUrl(navigationItem.path as string)}
        >
          <TileListItem
            name={navigationItem.name}
            icon={navigationItem.icon}
          />
        </Link>
      ))}
    </TileList>
  );
};

export default NavigationTileList;
