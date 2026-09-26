'use server';

import { EServiceType } from '@/utils/configuration.type';
import { getCurrentServiceConfiguration } from '@/utils/configuration.utils';
import { fetchService } from '@/utils/fetchService';
import { getAccessToken } from '@/utils/getAccessToken';

export async function executeFunction(
  functionId: string,
  versionId: string,
  options: { args: Array<unknown> },
) {
  const config = await getCurrentServiceConfiguration(EServiceType.FUNCTION);
  if (!config.worker_url) {
    throw new Error('no worker_url specified');
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    throw new Error('could not get access token');
  }

  const url = new URL(
    `/v1/functions/${functionId}/versions/${versionId}/executions`,
    config.worker_url,
  );
  url.searchParams.set('wait', 'true');
  const res = await fetchService(url.toString(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      arguments: options.args,
    }),
  });

  if (!res.ok) {
    return {
      error: true,
    };
  }

  const data = await res.json();

  console.log('config', config.worker_url, functionId, versionId, options);

  return data;
}
