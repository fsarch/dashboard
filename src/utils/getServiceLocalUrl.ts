import 'server-only';
import { headers, type UnsafeUnwrappedHeaders } from "next/headers";

export function getServiceLocalUrl(path: string) {
  const serviceType = (headers() as unknown as UnsafeUnwrappedHeaders).get('X-Service-Type');
  const serviceId = (headers() as unknown as UnsafeUnwrappedHeaders).get('X-Service-Id');

  return `/${serviceType}/${serviceId}/${path}`;
}
