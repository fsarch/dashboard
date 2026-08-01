'use server';

import { fetchService } from '@/utils/fetchService';
import { revalidatePath } from 'next/cache';

/**
 * Server Action zum Erstellen einer neuen Projekt-Version mit Archiv-Datei (TAR oder ZIP)
 * Sendet die Datei als FormData (multipart/form-data) an die API
 * Fügt den fileContentType als Feld hinzu, damit der Server den Datei-Typ erkennt
 */
export const createProjectVersion = async (formData: FormData) => {
  const projectId = formData.get('projectId') as string;
  const file = formData.get('file') as File | null;

  if (!projectId) {
    throw new Error('projectId is required');
  }

  if (!file) {
    throw new Error('file is required');
  }

  // An die API senden
  const response = await fetchService(
    `/v1/api/projects/${projectId}/versions`,
    {
      method: 'POST',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    }
  );

  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    throw new Error(`Failed to create project version: ${error}`);
  }

  const result = await response.json().catch(() => ({}));

  // Cache invalidieren und Seite neu laden
  revalidatePath('/');

  return {
    success: true,
    data: result,
  };
};
