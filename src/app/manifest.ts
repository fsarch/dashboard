import type { MetadataRoute } from 'next'
import { getThemeConfiguration } from "@/utils/configuration.utils";

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const theme = await getThemeConfiguration();

  return {
    name: 'Dashboard',
    short_name: 'Dashboard',
    description: 'Manage all your projects and services in one place.',
    start_url: '/',
    display: 'standalone',
    background_color: theme.backgroundColor.hex,
    theme_color: theme.primaryColor.hex,
    icons: [
      {
        src: '/icons/main-background/192x192/icon',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/main-background/512x512/icon',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
