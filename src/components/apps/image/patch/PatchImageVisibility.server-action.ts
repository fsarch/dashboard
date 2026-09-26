'use server';

import { revalidatePath } from 'next/cache';
import { imagesAdminService } from '@/services/image/images-admin.service';

export const patchImageVisibility = async (
  imageId: string,
  isPublic: boolean,
) => {
  await imagesAdminService.patchImage(imageId, { isPublic });

  // Revalidate the image detail page and list page to show updated visibility
  revalidatePath(`/image/[serviceId]/images/${imageId}`, 'page');
  revalidatePath(`/image/[serviceId]`, 'page');
};
