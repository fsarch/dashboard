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

const uploadImage = async (options: { data: Buffer; name?: string; }): Promise<void> => {
  const headers: Record<string, string> = {};
  if (options.name) {
    headers['x-path'] = options.name;
  }

  const imagesResponse = await fetchService(`/v1/admin/images/_actions/upload`, {
    method: 'POST',
    headers,
    body: options.data,
  });
  if (!imagesResponse.ok) {
    throw new Error('invalid response');
  }
};

export const imagesAdminService = {
  listImages,
  getRawById,
  uploadImage,
};
