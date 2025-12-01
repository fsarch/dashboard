import { fetchService } from "@/utils/fetchService";
import { ImageDto } from "@/services/image/images-admin.type";
import { ServerLogger } from "@/utils/ServerLogger";
import { fetchCustom } from "@/utils/fetchCustom";

const serverLogger = new ServerLogger('ImageServerAdminService');

const listImages = async (): Promise<Array<ImageDto>> => {
  const imagesResponse = await fetchService('/v1/admin/images?embed=slugs');
  const images = await imagesResponse.json();

  return images;
};

const getRawById = async (imageId: string, options: { size?: number; } = {}): Promise<ArrayBuffer> => {
  const queryParams = new URLSearchParams();
  if (options.size) {
    queryParams.set('size', options.size.toString());
  }

  const imagesResponse = await fetchService(`/v1/admin/images/${imageId}/raw?${queryParams}`, {
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
    body: new Uint8Array(options.data).buffer,
  });
  if (!imagesResponse.ok) {
    throw new Error('invalid response');
  }
};

const uploadImageByUrl = async (options: { imageServerUrl: string; data: Buffer; name?: string; }): Promise<{ id: string }> => {
  const headers: Record<string, string> = {};
  if (options.name) {
    headers['x-path'] = options.name;
  }

  const imagesResponse = await fetchCustom(`${options.imageServerUrl}/v1/admin/images/_actions/upload`, {
    method: 'POST',
    headers,
    body: new Uint8Array(options.data).buffer,
  });
  if (!imagesResponse.ok) {
    serverLogger.error('failed to upload image by url', {
      imageServerUrl: options.imageServerUrl,
      response: {
        body: await imagesResponse.text(),
        statusCode: imagesResponse.status,
      },
    });

    throw new Error('invalid response');
  }

  return imagesResponse.json();
};

export const imagesAdminService = {
  listImages,
  getRawById,
  uploadImage,
  uploadImageByUrl,
};
