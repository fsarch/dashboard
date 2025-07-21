import { getServiceConfiguration } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { APPS } from "@/constants/apps";

export default async function Home() {
  const foundService = await getServiceConfiguration(EServiceType.PRINTER);

  if (foundService) {
    return redirect(`${APPS[EServiceType.PRINTER].basePath}/${foundService.id}`)
  }

  return (
    <main>
      Printer Server
    </main>
  );
}
