'use client';

import Link from 'next/link';
import React from 'react';
import AssetTileContextMenu from '@/components/apps/drive/context-menu/AssetTileContextMenu.component';
import FolderTileContextMenu from '@/components/apps/drive/context-menu/FolderTileContextMenu.component';
import DriveFloatingButtonListener from '@/components/apps/drive/floating-button/DriveFloatingButtonListener.component';
import DriveDropzone from '@/components/apps/drive/upload/DriveDropzone.component';
import {
  ASSET_TYPE_ICON,
  getAssetContentUrl,
  isImageAsset,
} from '@/components/apps/file-server-shared/AssetThumbnail.component';
import { useOpenContextMenu } from '@/components/universals/context-menu/ContextMenuProvider.context';
import LinkTileListItem from '@/components/universals/tile-list/LinkTileListItem';
import TileList from '@/components/universals/tile-list/TileList';
import type {
  TAsset,
  TFolder,
  TFolderPathEntry,
} from '@/services/file-server/file-server-api.type';
import styles from './FolderListing.module.scss';

type FolderListingProps = {
  serviceId: string;
  folderId: string | null;
  path: TFolderPathEntry[];
  folders: TFolder[];
  assets: TAsset[];
};

const FolderListing: React.FunctionComponent<FolderListingProps> = ({
  serviceId,
  folderId,
  path,
  folders,
  assets,
}) => {
  const openContextMenu = useOpenContextMenu();

  return (
    <DriveDropzone serviceId={serviceId} folderId={folderId}>
      <DriveFloatingButtonListener serviceId={serviceId} folderId={folderId} />

      <nav className={styles.breadcrumb}>
        <Link href={`/drive/${serviceId}`}>Drive</Link>
        {path.map((entry) => (
          <React.Fragment key={entry.id}>
            {' / '}
            <Link href={`/drive/${serviceId}/folder/${entry.id}`}>
              {entry.name}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      <TileList orientation="left">
        {folders.map((folder) => (
          <LinkTileListItem
            key={folder.id}
            name={folder.name}
            icon="folder"
            href={`/drive/${serviceId}/folder/${folder.id}`}
            onContextMenu={(event) =>
              openContextMenu(
                FolderTileContextMenu,
                { serviceId, folder },
                event,
              )
            }
          />
        ))}
        {assets.map((asset) => (
          <LinkTileListItem
            key={asset.id}
            name={asset.name}
            href={`/drive/${serviceId}/asset/${asset.id}`}
            icon={
              isImageAsset(asset)
                ? undefined
                : (ASSET_TYPE_ICON[asset.type] ?? 'file')
            }
            image={
              isImageAsset(asset)
                ? getAssetContentUrl('/drive', serviceId, asset.id)
                : undefined
            }
            onContextMenu={(event) =>
              openContextMenu(AssetTileContextMenu, { serviceId, asset }, event)
            }
          />
        ))}
      </TileList>

      {folders.length === 0 && assets.length === 0 ? (
        <p>Dieser Ordner ist leer.</p>
      ) : null}
    </DriveDropzone>
  );
};

export default FolderListing;
