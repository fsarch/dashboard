import React from 'react';
import { NavigationItem } from "@/constants/services";
import Link from "next/link";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import TileListItem from "@/components/universals/tile-list/TileListItem";
import TileList from "@/components/universals/tile-list/TileList";

type NavigationTileListProps = {
  navigation: Array<NavigationItem>;
};

const NavigationTileList: React.FunctionComponent<NavigationTileListProps> = async ({
  navigation,
}) => {
  return (
    <TileList>
      {navigation.map(async (navigationItem) => (
        <Link
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
