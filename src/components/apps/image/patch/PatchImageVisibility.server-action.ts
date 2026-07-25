'use server';

import { imagesAdminService } from "@/services/image/images-admin.service";
import { revalidatePath } from "next/cache";

export const patchImageVisibility = async (imageId: string, isPublic: boolean) => {
  await imagesAdminService.patchImage(imageId, { isPublic });

  // Revalidate the image detail page and list page to show updated visibility
  revalidatePath(`/image/[serviceId]/images/${imageId}`, 'page');
  revalidatePath(`/image/[serviceId]`, 'page');
};
