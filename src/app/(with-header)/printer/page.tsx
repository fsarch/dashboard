import { getServiceConfiguration } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { SERVICES } from "@/constants/services";

export default async function Home() {
  const foundService = await getServiceConfiguration(EServiceType.PRINTER_SERVER);

  if (foundService) {
    return redirect(`${SERVICES[EServiceType.PRINTER_SERVER].basePath}/${foundService.id}`)
  }

  return (
    <main>
      Printer Server
    </main>
  );
}