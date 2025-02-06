import { fetchService } from "@/utils/fetchService";

const getById = async (imageId: string, preset: string): Promise<ArrayBuffer> => {
  const imagesResponse = await fetchService(`/v1/images/by-id/${imageId}/presets/${preset}`, {
    headers: {
      'Accept': 'image/png',
    },
  });
  const image = await imagesResponse.arrayBuffer();

  return image;
};

export const imagesService = {
  getById,
};
