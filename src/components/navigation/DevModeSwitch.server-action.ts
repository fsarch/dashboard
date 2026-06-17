'use server';

import { cookies } from 'next/headers';

export async function toggleDevMode(enabled: boolean): Promise<void> {
  const cookieStore = await cookies();
  
  if (enabled) {
    await cookieStore.set('dev-mode', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      httpOnly: false,
      sameSite: 'lax',
    });
  } else {
    await cookieStore.delete('dev-mode');
  }
}

export async function getDevMode(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has('dev-mode');
}
