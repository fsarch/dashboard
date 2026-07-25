import { fetchService } from "@/utils/fetchService";
import {
  ImageDto,
  TagDefinitionDto,
  PaginationResultDto,
  ListImagesOptions,
} from "@/services/image/images-admin.type";
import { ServerLogger } from "@/utils/ServerLogger";
import { fetchCustom } from "@/utils/fetchCustom";

const serverLogger = new ServerLogger('ImageServerAdminService');

const listImages = async (
  options?: ListImagesOptions
): Promise<PaginationResultDto<ImageDto>> => {
  const queryParams = new URLSearchParams();

  if (options?.embed) {
    queryParams.set('embed', options.embed.join(','));
  }
  if (options?.isPublic !== undefined) {
    queryParams.set('isPublic', options.isPublic.toString());
  }
  if (options?.tag?.length) {
    queryParams.set('tag', options.tag.join(','));
  }
  if (options?.page) {
    queryParams.set('page', options.page.toString());
  }
  if (options?.limit) {
    queryParams.set('limit', options.limit.toString());
  }

  const imagesResponse = await fetchService(
    `/v1/admin/images?${queryParams.toString()}`
  );
  const result = await imagesResponse.json();

  return result;
};

const getImageById = async (imageId: string): Promise<ImageDto> => {
  const response = await fetchService(`/v1/admin/images/${imageId}?embed=tags`);
  return response.json();
};

const patchImage = async (imageId: string, data: { isPublic?: boolean; }): Promise<ImageDto> => {
  const response = await fetchService(`/v1/admin/images/${imageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// Tag-Definitionen
const listTagDefinitions = async (): Promise<TagDefinitionDto[]> => {
  const response = await fetchService('/v1/admin/images/tags/definitions');
  return response.json();
};

const createTagDefinition = async (data: {
  key: string;
  description?: string;
}): Promise<TagDefinitionDto> => {
  const response = await fetchService('/v1/admin/images/tags/definitions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteTagDefinition = async (tagDefinitionId: string): Promise<void> => {
  await fetchService(
    `/v1/admin/images/tags/definitions/${tagDefinitionId}`,
    {
      method: 'DELETE',
    }
  );
};

// Bild-Tags
const listImageTags = async (imageId: string): Promise<string[]> => {
  const response = await fetchService(`/v1/admin/images/${imageId}/tags`);
  return response.json();
};

const addImageTag = async (
  imageId: string,
  data: { key: string; value: string }
): Promise<string> => {
  const response = await fetchService(`/v1/admin/images/${imageId}/tags`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteImageTag = async (imageId: string, tagValue: string): Promise<void> => {
  await fetchService(
    `/v1/admin/images/${imageId}/tags/${encodeURIComponent(tagValue)}`,
    {
      method: 'DELETE',
    }
  );
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

const uploadImage = async (options: { data: Buffer; name?: string; isPublic?: boolean; }): Promise<void> => {
  const headers: Record<string, string> = {};
  if (options.name) {
    headers['x-path'] = options.name;
  }
  if (options.isPublic !== undefined) {
    headers['x-visibility'] = options.isPublic ? 'public' : 'private';
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

const uploadImageByUrl = async (options: { imageServerUrl: string; data: Buffer; name?: string; isPublic?: boolean; }): Promise<{ id: string }> => {
  const headers: Record<string, string> = {};
  if (options.name) {
    headers['x-path'] = options.name;
  }
  if (options.isPublic !== undefined) {
    headers['x-visibility'] = options.isPublic ? 'public' : 'private';
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
  getImageById,
  uploadImage,
  uploadImageByUrl,
  patchImage,
  // Tag-Definitionen
  listTagDefinitions,
  createTagDefinition,
  deleteTagDefinition,
  // Bild-Tags
  listImageTags,
  addImageTag,
  deleteImageTag,
};
