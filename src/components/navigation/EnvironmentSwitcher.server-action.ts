'use server';

import { cookies } from 'next/headers';

const COOKIE_NAME = 'selected-environment';

export async function setSelectedEnvironment(
  environmentId: string,
): Promise<void> {
  const cookieStore = await cookies();
  await cookieStore.set(COOKIE_NAME, environmentId, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    httpOnly: false,
    sameSite: 'lax',
  });
}

export async function getSelectedEnvironment(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}
