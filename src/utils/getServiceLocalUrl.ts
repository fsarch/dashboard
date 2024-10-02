import 'server-only';
import { headers } from "next/headers";

export function getServiceLocalUrl(path: string) {
  const serviceType = headers().get('X-Service-Type');
  const serviceId = headers().get('X-Service-Id');

  return `/${serviceType}/${serviceId}/${path}`;
}
