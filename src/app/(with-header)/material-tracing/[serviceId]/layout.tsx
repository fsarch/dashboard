import type { PropsWithChildren } from "react";
import ShortCodeScanFloatingButton
  from "@/app/(with-header)/material-tracing/[serviceId]/_components/floating-button/ShortCodeScanFloatingButton";

export default async function RootLayout(props: PropsWithChildren) {
  const {
    children,
  } = props;

  return (
    <>
      {children}
      <ShortCodeScanFloatingButton />
    </>
  );
}
