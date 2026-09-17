import 'server-only';
import { NextResponse } from 'next/server';
import { fileServerApiService } from '@/services/file-server/file-server-api.service';

const PASSTHROUGH_HEADERS = [
  'content-type',
  'content-disposition',
  'content-length',
  'content-range',
  'accept-ranges',
];

// Shared by every app's asset/[assetId]/{content,download}/route.ts (see
// drive and dam) - proxies file-server's GET /assets/:id/content|download
// through the dashboard server so the Authorization header (added by
// fetchService from the logged-in user's session) never needs to reach the
// browser, and so <img>/download links can stay same-origin.
export async function proxyAssetContent(
  assetId: string,
  disposition: 'content' | 'download',
  rangeHeader: string | null,
): Promise<NextResponse> {
  const upstream = await fileServerApiService.fetchAssetContent(
    assetId,
    disposition,
    rangeHeader ?? undefined,
  );

  const headers = new Headers();
  for (const name of PASSTHROUGH_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) {
      headers.set(name, value);
    }
  }
  headers.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers,
  });
}
