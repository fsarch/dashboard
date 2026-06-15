import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/getAccessToken';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { uacUtils } from '@/utils/uac.utils';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> },
) {
  const { serviceId } = await params;

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const canAccessDevelopment = await uacUtils.hasPermission('dev', accessToken);
  if (!canAccessDevelopment) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const serviceConfiguration = await getServiceConfigurationById(serviceId);
  if (!serviceConfiguration) {
    return NextResponse.json({ error: 'Service not found' }, { status: 404 });
  }

  const baseUrl = serviceConfiguration.url.endsWith('/')
    ? serviceConfiguration.url.slice(0, -1)
    : serviceConfiguration.url;

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${accessToken}`);

  // Try JSON first, then YAML
  for (const path of ['/docs-json', '/docs-yaml']) {
    try {
      const res = await fetch(`${baseUrl}${path}`, { headers });
      if (res.ok) {
        const contentType = res.headers.get('content-type') ?? 'application/json';
        const body = await res.text();
        return new NextResponse(body, {
          status: 200,
          headers: { 'Content-Type': contentType },
        });
      }
    } catch {
      // try next
    }
  }

  return NextResponse.json({ error: 'No API documentation found' }, { status: 404 });
}

