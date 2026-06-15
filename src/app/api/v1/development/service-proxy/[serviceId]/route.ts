import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken } from '@/utils/getAccessToken';
import { getServiceConfigurationById } from '@/utils/configuration.utils';
import { uacUtils } from '@/utils/uac.utils';

const BLOCKED_REQUEST_HEADERS = new Set([
  'host',
  'connection',
  'content-length',
  'cookie',
]);

const BLOCKED_RESPONSE_HEADERS = new Set([
  'content-length',
  'content-encoding',
  'transfer-encoding',
]);

function resolveTargetUrl(targetPath: string, serviceBaseUrl: string): URL {
  if (!targetPath.startsWith('/')) {
    throw new Error('target must be an absolute path');
  }

  const normalizedBase = serviceBaseUrl.endsWith('/') ? serviceBaseUrl : `${serviceBaseUrl}/`;
  return new URL(targetPath, normalizedBase);
}

async function proxyRequest(
  req: NextRequest,
  params: Promise<{ serviceId: string }>,
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

  const targetPath = req.nextUrl.searchParams.get('target');
  if (!targetPath) {
    return NextResponse.json({ error: 'Missing target query parameter' }, { status: 400 });
  }

  let targetUrl: URL;
  try {
    targetUrl = resolveTargetUrl(targetPath, serviceConfiguration.url);
  } catch {
    return NextResponse.json({ error: 'Invalid target path' }, { status: 400 });
  }

  const requestHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase())) {
      requestHeaders.set(key, value);
    }
  });

  requestHeaders.set('Authorization', `Bearer ${accessToken}`);

  const requestInit: RequestInit = {
    method: req.method,
    headers: requestHeaders,
    redirect: 'manual',
  };

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    requestInit.body = await req.arrayBuffer();
  }

  const upstreamResponse = await fetch(targetUrl, requestInit);

  const responseHeaders = new Headers();
  upstreamResponse.headers.forEach((value, key) => {
    if (!BLOCKED_RESPONSE_HEADERS.has(key.toLowerCase())) {
      responseHeaders.set(key, value);
    }
  });

  return new NextResponse(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: responseHeaders,
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}

export async function OPTIONS(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}

export async function HEAD(req: NextRequest, { params }: { params: Promise<{ serviceId: string }> }) {
  return proxyRequest(req, params);
}


