import { forbidden } from 'next/navigation';
import { getAccessToken } from '@/utils/getAccessToken';

async function requireAuth() {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    return forbidden();
  }
}

export const authUtils = {
  requireAuth,
};
