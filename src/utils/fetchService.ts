import { headers } from "next/headers";
import { getServiceConfigurationById } from "@/utils/configuration.utils";
import { getAccessToken } from "@/utils/getAccessToken";

export async function fetchService(url: string, init?: RequestInit, options?: { serviceId: string; }): Promise<Response> {
  let serviceId = options?.serviceId ?? headers().get('X-Service-Id');
  if (Array.isArray(serviceId)) {
    serviceId = serviceId[0];
  }

  if (!serviceId) {
    throw new Error('no service id');
  }

  const serviceConfiguration = await getServiceConfigurationById(serviceId);
  if (!serviceConfiguration) {
    throw new Error('could not get service configuration');
  }

  const requestHeaders = new Headers(init?.headers);

  if (!requestHeaders.has('Authorization')) {
    const accessToken = await getAccessToken();
    console.log('accessToken', accessToken);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetchUrl = new URL(url, serviceConfiguration.url);

  const res = await fetch(fetchUrl, {
    ...init,
    headers: requestHeaders,
  });

  console.debug(`[${init?.method || 'GET'}] ${res.url} - ${res.status}`)

  return res;
}
