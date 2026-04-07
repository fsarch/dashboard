import 'server-only';
import { headers } from "next/headers";

export async function getServiceLocalUrl(path: string) {
  const serviceType = (await headers()).get('X-Service-Type');
  const serviceId = (await headers()).get('X-Service-Id');
  const normalizedPath = path.replace(/^\/+/, '');

  return normalizedPath
    ? `/${serviceType}/${serviceId}/${normalizedPath}`
    : `/${serviceType}/${serviceId}`;
}
