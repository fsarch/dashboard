import 'server-only';

import React from 'react';
import { materialService } from '@/services/material-tracing/material.service';
import { proxyRequestUtils } from '@/utils/proxy-request.utils';
import styles from './MaterialImage.module.scss';

type MaterialImageProps = {
  imageRef: string;
};

const MaterialImage: React.FunctionComponent<MaterialImageProps> = async ({
  imageRef,
}) => {
  const adminUrl = await materialService.getImageServerAdminUrl();
  if (!adminUrl) {
    return null;
  }

  const proxyUrl = await proxyRequestUtils.create({
    url: `${adminUrl}/v1/admin/images/${imageRef}/raw`,
    method: 'GET',
  });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={proxyUrl}
      alt=""
      className={styles.image}
    />
  );
};

export default MaterialImage;

