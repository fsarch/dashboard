import { NextRequest, NextResponse } from "next/server";
import { SERVICES } from "@/constants/services";

const basePaths = Object.values(SERVICES).map((s) => s.basePath.substring(1));
const SERVICE_ID_REGEX = new RegExp(`^\\/(${basePaths.join('|')})\\/([^\\/]*)\\/?`);

export async function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const matches = request.nextUrl.pathname.match(SERVICE_ID_REGEX);
  if (matches) {
    requestHeaders.set('X-Service-Id', matches[2]);
    requestHeaders.set('X-Service-Type', matches[1]);
  }

  requestHeaders.set('X-Original-URL', request.nextUrl.href);

  return NextResponse.rewrite(request.nextUrl, {
    request: {
      headers: requestHeaders,
    },
  });
}
