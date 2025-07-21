import { getServiceConfiguration } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { APPS } from "@/constants/apps";

export default async function Home() {
  const foundService = await getServiceConfiguration(EServiceType.PIM);

  if (foundService) {
    return redirect(`${APPS[EServiceType.PIM].basePath}/${foundService.id}`)
  }

  return (
    <main>
      PIMs
    </main>
  );
}
