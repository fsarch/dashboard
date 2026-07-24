'use server';

import { imagesAdminService } from "@/services/image/images-admin.service";

export const uploadImage = async (options: { base64: string; name: string; isPublic: boolean; }) => {
  const buffer = Buffer.from(options.base64, 'base64');

  await imagesAdminService.uploadImage({
    data: buffer,
    name: options.name,
    isPublic: options.isPublic,
  });
};
