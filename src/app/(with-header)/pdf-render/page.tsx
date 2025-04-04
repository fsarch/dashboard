import { getServiceConfiguration } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { SERVICES } from "@/constants/services";

export default async function Home() {
  const foundService = await getServiceConfiguration(EServiceType.PDF_RENDER);

  if (foundService) {
    return redirect(`${SERVICES[EServiceType.PDF_RENDER].basePath}/${foundService.id}`)
  }

  return (
    <main>
      PIMs
    </main>
  );
}
