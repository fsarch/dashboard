import React from 'react';
import Icon from '@/components/universals/icon/Icon.component';
import { IconName } from '@fortawesome/fontawesome-svg-core';
import { TAsset } from '@/services/file-server/file-server-api.type';
import styles from './AssetThumbnail.module.scss';

type AssetThumbnailProps = {
  // basePath of the app rendering this thumbnail ('/drive' or '/dam') - the
  // content route is duplicated per-app (see [serviceId]/asset/[assetId]/content/route.ts)
  // so it inherits that app's X-Service-Id/X-Service-Type proxy headers.
  basePath: string;
  serviceId: string;
  asset: Pick<TAsset, 'id' | 'name' | 'mimeType' | 'type' | 'currentVersionId'>;
  size?: number;
};

// Exported for callers that render assets via other tile primitives (e.g.
// LinkTileListItem's icon/backgroundImage props) instead of this component.
export const ASSET_TYPE_ICON: Record<string, IconName> = {
  file: 'file',
  image: 'image',
  video: 'file-video',
  audio: 'file-audio',
  document: 'file-lines',
  archive: 'file-zipper',
  other: 'file',
};

export const isImageAsset = (asset: Pick<TAsset, 'mimeType' | 'currentVersionId'>): boolean =>
  Boolean(asset.currentVersionId && asset.mimeType?.startsWith('image/'));

export const getAssetContentUrl = (basePath: string, serviceId: string, assetId: string): string =>
  `${basePath}/${serviceId}/asset/${assetId}/content`;

const AssetThumbnail: React.FunctionComponent<AssetThumbnailProps> = ({
  basePath,
  serviceId,
  asset,
  size = 96,
}) => {
  if (isImageAsset(asset)) {
    return (
      <img
        src={getAssetContentUrl(basePath, serviceId, asset.id)}
        alt={asset.name}
        width={size}
        height={size}
        className={styles.thumbnail}
      />
    );
  }

  return (
    <div className={styles.iconThumbnail} style={{ width: size, height: size }}>
      <Icon icon={ASSET_TYPE_ICON[asset.type] ?? 'file'} />
    </div>
  );
};

export default AssetThumbnail;
