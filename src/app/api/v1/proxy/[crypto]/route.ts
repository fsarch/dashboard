import { authUtils } from '@/utils/auth.utils';
import { proxyRequestUtils } from '@/utils/proxy-request.utils';

export async function GET(
  request: Request,
  ctx: RouteContext<'/api/v1/proxy/[crypto]'>,
) {
  const { crypto } = await ctx.params;

  await authUtils.requireAuth();

  const response = await proxyRequestUtils.execute(crypto);

  return response;
}
