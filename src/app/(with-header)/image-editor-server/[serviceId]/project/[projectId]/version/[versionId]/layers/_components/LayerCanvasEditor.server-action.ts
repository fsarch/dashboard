'use server';

import { revalidatePath } from 'next/cache';
import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';
import { BindableAffineMatrix, LayerDto, LayerOptions, LayerType } from '@/services/image-editor-server/image-editor-server.type';

const PAGE_PATH = '/image-editor-server/[serviceId]/project/[projectId]/version/[versionId]/layers';

export const createLayerAction = async (
  projectId: string,
  versionId: string,
  data: { name: string; type: LayerType; order: number },
): Promise<LayerDto> => {
  const layer = await imageEditorServerService.createLayer(projectId, versionId, {
    ...data,
    transformationMatrix: {
      a: { type: 'constant', value: 1 },
      b: { type: 'constant', value: 0 },
      c: { type: 'constant', value: 0 },
      d: { type: 'constant', value: 1 },
      e: { type: 'constant', value: 0 },
      f: { type: 'constant', value: 0 },
    },
    options: defaultOptionsForType(data.type),
  });

  revalidatePath(PAGE_PATH, 'page');
  return layer;
};

// Geometry (position/rotation, i.e. the transformationMatrix) and size
// (options.width/height) are updated via separate calls, both from the
// client's already-known copy of the layer - so neither needs a
// server-side re-fetch just to merge fields.
export const updateLayerGeometryAction = async (
  projectId: string,
  versionId: string,
  layerId: string,
  transformationMatrix: BindableAffineMatrix,
): Promise<LayerDto> => {
  const layer = await imageEditorServerService.updateLayer(projectId, versionId, layerId, { transformationMatrix });
  revalidatePath(PAGE_PATH, 'page');
  return layer;
};

export const updateLayerOptionsAction = async (
  projectId: string,
  versionId: string,
  layerId: string,
  options: LayerOptions,
): Promise<LayerDto> => {
  const layer = await imageEditorServerService.updateLayer(projectId, versionId, layerId, { options });
  revalidatePath(PAGE_PATH, 'page');
  return layer;
};

// Resizing changes BOTH options.width/height AND the transformationMatrix
// (since a rotated layer's e/f depend on its center, which shifts with
// width/height - see matrix.utils.ts's composeMatrix) - sent as one PATCH
// so the layer is never briefly persisted in an inconsistent combination.
export const updateLayerGeometryAndSizeAction = async (
  projectId: string,
  versionId: string,
  layerId: string,
  transformationMatrix: BindableAffineMatrix,
  options: LayerOptions,
): Promise<LayerDto> => {
  const layer = await imageEditorServerService.updateLayer(projectId, versionId, layerId, { transformationMatrix, options });
  revalidatePath(PAGE_PATH, 'page');
  return layer;
};

export const updateLayerOrderAction = async (
  projectId: string,
  versionId: string,
  layerId: string,
  order: number,
): Promise<LayerDto> => {
  const layer = await imageEditorServerService.updateLayer(projectId, versionId, layerId, { order });
  revalidatePath(PAGE_PATH, 'page');
  return layer;
};

export const updateLayerNameAction = async (
  projectId: string,
  versionId: string,
  layerId: string,
  name: string,
): Promise<LayerDto> => {
  const layer = await imageEditorServerService.updateLayer(projectId, versionId, layerId, { name });
  revalidatePath(PAGE_PATH, 'page');
  return layer;
};

export const deleteLayerAction = async (projectId: string, versionId: string, layerId: string): Promise<void> => {
  await imageEditorServerService.deleteLayer(projectId, versionId, layerId);
  revalidatePath(PAGE_PATH, 'page');
};

// 1x1 transparent PNG - the smallest possible valid PNG, used purely as a
// visible starting point for a freshly added image layer until the admin
// uploads a real one via the properties panel.
const PLACEHOLDER_IMAGE_BASE64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

function defaultOptionsForType(type: LayerType): LayerOptions {
  switch (type) {
    case 'text':
      return {
        content: { type: 'constant', value: 'Text' },
        fontFamily: { type: 'constant', value: 'sans-serif' },
        fontSize: { type: 'constant', value: 16 },
        color: { type: 'constant', value: '#000000' },
      };
    case 'image':
      return {
        image: { type: 'constant', value: { type: 'base64', value: PLACEHOLDER_IMAGE_BASE64 } },
        width: { type: 'constant', value: 100 },
        height: { type: 'constant', value: 100 },
      };
    case 'shape':
      return {
        shape: { type: 'constant', value: 'rectangle' },
        width: { type: 'constant', value: 100 },
        height: { type: 'constant', value: 100 },
        fillColor: { type: 'constant', value: '#cccccc' },
      };
    case 'html':
      return {
        html: { type: 'constant', value: '<div>HTML</div>' },
        width: { type: 'constant', value: 100 },
        height: { type: 'constant', value: 100 },
      };
  }
}
