import type { Metadata, Viewport } from "next";
import Local from "next/font/local";
import styles from './layout.module.scss';
import './globals.scss';
import clsx from "clsx";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/utils/getAccessToken";
import { jwtVerify } from "jose";
import { getJwks } from "@/utils/getJwks";
import LoadingProvider from "@/components/universals/loader/LoadingProvider";
import { CSSProperties } from "react";
import { getThemeConfiguration } from "@/utils/configuration.utils";

const inter = Local({ src: './_fonts/inter/Inter-Regular.woff2' });

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Dashboard",
  description: 'A dashboard for managing your services',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
  header,
}: Readonly<{
  header: React.ReactNode;
  children: React.ReactNode;
}>) {
  const JWKS = getJwks();

  const accessToken = await getAccessToken();
  if (!accessToken) {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  try {
    await jwtVerify(accessToken, JWKS);
  } catch {
    const callbackUrl = (await headers()).get('X-Original-URL') || '/';
    return redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  const theme = await getThemeConfiguration();

  return (
    <html lang="en">
    <body
      className={clsx(inter.className, styles.body)}
      style={{
        '--color-primary-rgb': theme.primaryColor.rgbComponents,
        '--color-background-rgb': theme.backgroundColor.rgbComponents,
      } as CSSProperties}
    >
    <LoadingProvider>
      {children}
    </LoadingProvider>
    </body>
    </html>
  );
}
