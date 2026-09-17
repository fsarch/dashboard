import React from 'react';
import Link from 'next/link';
import Icon from '@/components/universals/icon/Icon.component';
import { TAsset, TFolder, TFolderPathEntry } from '@/services/file-server/file-server-api.type';
import AssetThumbnail from '@/components/apps/file-server-shared/AssetThumbnail.component';
import styles from './AssetGallery.module.scss';

type AssetGalleryProps = {
  serviceId: string;
  path: TFolderPathEntry[];
  folders: TFolder[];
  assets: TAsset[];
};

const AssetGallery: React.FunctionComponent<AssetGalleryProps> = ({
  serviceId,
  path,
  folders,
  assets,
}) => {
  return (
    <>
      <nav className={styles.breadcrumb}>
        <Link href={`/dam/${serviceId}`}>Mediathek</Link>
        {path.map((entry) => (
          <React.Fragment key={entry.id}>
            {' / '}
            <Link href={`/dam/${serviceId}/folder/${entry.id}`}>{entry.name}</Link>
          </React.Fragment>
        ))}
      </nav>

      <div className={styles.grid}>
        {folders.map((folder) => (
          <Link key={folder.id} href={`/dam/${serviceId}/folder/${folder.id}`} className={styles.tile}>
            <div className={styles.folderTile}>
              <Icon icon="folder" />
            </div>
            <div className={styles.tileLabel}>{folder.name}</div>
          </Link>
        ))}
        {assets.map((asset) => (
          <Link key={asset.id} href={`/dam/${serviceId}/asset/${asset.id}`} className={styles.tile}>
            <AssetThumbnail basePath="/dam" serviceId={serviceId} asset={asset} size={160} />
            <div className={styles.tileLabel}>{asset.name}</div>
          </Link>
        ))}
      </div>

      {folders.length === 0 && assets.length === 0 ? <p>Keine Inhalte vorhanden.</p> : null}
    </>
  );
};

export default AssetGallery;
