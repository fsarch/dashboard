import { fetchCustom } from "@/utils/fetchCustom";
import { cryptoUtils } from './crypto.utils';

type ProxyRequestType = {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  addAccessToken?: boolean;
};

async function create({
  url,
  method,
  addAccessToken,
}: ProxyRequestType) {
  const payload = await cryptoUtils.sign({
    url,
    method,
    addAccessToken,
  });

  return `/api/v1/proxy/${payload}`;
}

async function execute(signedRequest: string) {
  const requestData = await cryptoUtils.verify<ProxyRequestType>(signedRequest);

  const res = await fetchCustom(requestData.url, {
    method: requestData.method,
  });

  return res;
}
async function debug(signedRequest: string) {
  const requestData = await cryptoUtils.verify<ProxyRequestType>(signedRequest);

  return requestData;
}

export const proxyRequestUtils = {
  create,
  execute,
  debug,
};
