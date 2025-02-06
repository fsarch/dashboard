import { fetchService } from "@/utils/fetchService";
import { ImageDto } from "@/services/image/images-admin.type";

const listImages = async (): Promise<Array<ImageDto>> => {
  const imagesResponse = await fetchService('/v1/admin/images');
  const images = await imagesResponse.json();

  return images;
};

const getRawById = async (imageId: string): Promise<ArrayBuffer> => {
  const imagesResponse = await fetchService(`/v1/admin/images/${imageId}/raw`, {
    headers: {
      'Accept': 'image/png',
    },
  });
  const image = await imagesResponse.arrayBuffer();

  return image;
};

export const imagesAdminService = {
  listImages,
  getRawById,
};
