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
    console.log('add access token', accessToken);
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  return await fetch(new URL(url, serviceConfiguration.url), {
    ...init,
    headers: requestHeaders,
  });
}
