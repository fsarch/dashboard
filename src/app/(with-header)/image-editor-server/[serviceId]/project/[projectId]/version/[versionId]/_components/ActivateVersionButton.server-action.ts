'use server';

import { revalidatePath } from 'next/cache';
import { imageEditorServerService } from '@/services/image-editor-server/image-editor-server.service';

export const activateVersion = async (projectId: string, versionId: string) => {
  await imageEditorServerService.activateProjectVersion(projectId, versionId);

  revalidatePath('/image-editor-server/[serviceId]/project/[projectId]/version/[versionId]', 'page');
  revalidatePath('/image-editor-server/[serviceId]/project/[projectId]/version', 'page');
};
