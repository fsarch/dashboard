import { getServiceConfiguration } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { APPS } from "@/constants/apps";

export default async function Home() {
  const foundService = await getServiceConfiguration(EServiceType.MATERIAL_TRACING);

  if (foundService) {
    return redirect(`${APPS[EServiceType.MATERIAL_TRACING].basePath}/${foundService.id}`)
  }

  return (
    <main>
      PIMs
    </main>
  );
}
