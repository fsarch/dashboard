import type { Metadata } from "next";
import React from "react";
import AutoSizer from "@/app/(embedded)/_components/autosizer.component";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: {
    index: false,
    follow: false,
  },
};

type LayoutProps = {
  children?: React.ReactNode
}

export default async function RootLayout({children}: LayoutProps) {
  return (
    <AutoSizer>
      {children}
    </AutoSizer>
  );
}
