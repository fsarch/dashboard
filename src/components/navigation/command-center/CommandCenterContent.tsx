import React, { useEffect, useState } from 'react';
import {
  queryData,
  QueryResponseType
} from "@/components/navigation/command-center/server/CommandCenter.server-action";
import Loader from "@/components/universals/loader/Loader";
import TileList from "@/components/universals/tile-list/TileList";
import LinkTileListItem from "@/components/universals/tile-list/LinkTileListItem";
import styles from './CommandCenterContent.module.scss';

type CommandCenterContentProps = {

};

const CommandCenterContent: React.FunctionComponent<CommandCenterContentProps> = () => {
  const [data, setData] = useState<QueryResponseType | null>(null);

  useEffect(() => {
    queryData().then(setData);
  }, []);

  if (!data) {
    return (
      <Loader/>
    );
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.headline}>Apps</h2>
      <TileList>
        {data.apps.map((app) => (
          <LinkTileListItem
            name={app.name}
            href={app.path}
            icon={app.icon}
            small
          />
        ))}
      </TileList>
    </div>
  );
};

export default CommandCenterContent;
