import type React from 'react';
import LinkTileListItem from '@/components/universals/tile-list/LinkTileListItem';
import TileList from '@/components/universals/tile-list/TileList';
import type { AppNavigationItem } from '@/constants/app.type';
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

type NavigationTileListProps = {
  navigation: Array<AppNavigationItem>;
};

const NavigationTileList: React.FunctionComponent<
  NavigationTileListProps
> = async ({ navigation }) => {
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
