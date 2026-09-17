import { proxyAssetContent } from '@/components/apps/file-server-shared/asset-content.route-helper';

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) => {
  const { assetId } = await params;
  return proxyAssetContent(assetId, 'content', request.headers.get('range'));
};
