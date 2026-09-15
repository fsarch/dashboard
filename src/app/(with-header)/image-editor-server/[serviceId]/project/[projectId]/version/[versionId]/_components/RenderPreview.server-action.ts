'use server';

import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';

export const renderVersionPreview = async (
  projectId: string,
  versionId: string,
  parameters: Record<string, unknown>,
) => {
  const result = await imageEditorServerService.renderProjectVersion(projectId, versionId, parameters);

  if (!result.ok) {
    return { ok: false as const, status: result.status, message: result.message };
  }

  return { ok: true as const, base64: result.base64 };
};
