import { fetchService } from '@/utils/fetchService';
import {
  BindableAffineMatrix,
  LayerDto,
  LayerOptions,
  LayerType,
  ParameterDto,
  ProjectVersionDto,
} from './image-editor-server.type';

// Backend-call logic for the parts of the image-editor-server app that
// don't go through GeneratedForm (the custom layer/canvas editor). Project/
// ProjectVersion/Parameter CRUD pages call fetchService directly inline
// (mirroring the `frontend` app's convention), since GeneratedForm already
// owns their create/update requests.

const getProjectVersion = async (projectId: string, versionId: string): Promise<ProjectVersionDto> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}`);
  return response.json();
};

const listProjectVersions = async (projectId: string): Promise<ProjectVersionDto[]> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions?take=1000`);
  const result = await response.json();
  return result.data;
};

const listParameters = async (projectId: string, versionId: string): Promise<ParameterDto[]> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/parameters?take=1000`);
  const result = await response.json();
  return result.data;
};

const listLayers = async (projectId: string, versionId: string): Promise<LayerDto[]> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/layers?take=1000`);
  const result = await response.json();
  return result.data as LayerDto[];
};

const createLayer = async (
  projectId: string,
  versionId: string,
  data: {
    name: string;
    type: LayerType;
    order: number;
    transformationMatrix: BindableAffineMatrix;
    options: LayerOptions;
  },
): Promise<LayerDto> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/layers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`failed to create layer: ${response.status} ${await response.text()}`);
  }

  return response.json();
};

const updateLayer = async (
  projectId: string,
  versionId: string,
  layerId: string,
  data: Partial<{
    name: string;
    order: number;
    transformationMatrix: BindableAffineMatrix;
    options: LayerOptions;
  }>,
): Promise<LayerDto> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/layers/${layerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`failed to update layer: ${response.status} ${await response.text()}`);
  }

  return response.json();
};

const deleteLayer = async (projectId: string, versionId: string, layerId: string): Promise<void> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/layers/${layerId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`failed to delete layer: ${response.status} ${await response.text()}`);
  }
};

const renderProjectVersion = async (
  projectId: string,
  versionId: string,
  parameters: Record<string, unknown>,
): Promise<{ ok: true; base64: string } | { ok: false; status: number; message: string }> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/_actions/render`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ parameters }),
  });

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, status: response.status, message: body };
  }

  const arrayBuffer = await response.arrayBuffer();
  return { ok: true, base64: Buffer.from(arrayBuffer).toString('base64') };
};

const activateProjectVersion = async (projectId: string, versionId: string): Promise<ProjectVersionDto> => {
  const response = await fetchService(`/v1/projects/${projectId}/versions/${versionId}/_actions/activate`, {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`failed to activate version: ${response.status} ${await response.text()}`);
  }

  return response.json();
};

export const imageEditorServerService = {
  getProjectVersion,
  listProjectVersions,
  listParameters,
  listLayers,
  createLayer,
  updateLayer,
  deleteLayer,
  renderProjectVersion,
  activateProjectVersion,
};
