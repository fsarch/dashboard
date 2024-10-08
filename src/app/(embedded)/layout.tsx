import type { Metadata } from "next";
import React from "react";
import AutoSizer from "@/app/(embedded)/_components/autosizer.component";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
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
