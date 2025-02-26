import { getAccessToken } from "@/utils/getAccessToken";

export async function fetchService(url: string, init?: RequestInit): Promise<Response> {
  const requestHeaders = new Headers(init?.headers);

  if (!requestHeaders.has('Authorization')) {
    const accessToken = await getAccessToken();
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const fetchUrl = new URL(url);

  const res = await fetch(fetchUrl, {
    ...init,
    headers: requestHeaders,
  });

  console.debug(`[${init?.method || 'GET'}] ${res.url} - ${res.status}`)

  return res;
}
