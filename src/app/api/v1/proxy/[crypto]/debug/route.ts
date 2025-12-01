import { proxyRequestUtils } from "@/utils/proxy-request.utils";
import { NextResponse } from "next/server";
import { authUtils } from "@/utils/auth.utils";

export async function GET(request: Request, ctx: RouteContext<'/api/v1/proxy/[crypto]/debug'>) {
  const { crypto } = await ctx.params;

  await authUtils.requireAuth();

  const response = await proxyRequestUtils.debug(crypto);

  return NextResponse.json(response);
}
