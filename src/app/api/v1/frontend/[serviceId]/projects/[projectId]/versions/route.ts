import { NextRequest, NextResponse } from 'next/server';
import { fetchService } from '@/utils/fetchService';
import { authUtils } from '@/utils/auth.utils';

/**
 * Nimmt den Datei-Upload direkt vom Browser entgegen (statt über eine Server Action),
 * damit der Client per XMLHttpRequest den Upload-Fortschritt verfolgen kann, und
 * reicht die Datei an den Frontend-Service weiter.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ serviceId: string; projectId: string }> },
) {
  await authUtils.requireAuth();

  const { serviceId, projectId } = await params;

  const body = await req.arrayBuffer();
  const contentType = req.headers.get('content-type') || 'application/octet-stream';

  const response = await fetchService(
    `/v1/projects/${projectId}/versions`,
    {
      method: 'POST',
      body,
      headers: {
        'Content-Type': contentType,
      },
    },
    { serviceId },
  );

  if (!response.ok) {
    const error = await response.text().catch(() => 'Unknown error');
    return NextResponse.json({ error }, { status: response.status });
  }

  const result = await response.json().catch(() => ({}));

  return NextResponse.json({ success: true, data: result });
}