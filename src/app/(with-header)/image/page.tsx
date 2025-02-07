import { getServiceConfigurations } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { SERVICES } from "@/constants/services";
import List from "@/components/universals/list/List";
import Link from "next/link";
import ListItem from "@/components/universals/list/ListItem";

export default async function Home() {
  const foundServices = await getServiceConfigurations(EServiceType.IMAGE);

  if (foundServices.length === 1) {
    return redirect(`${SERVICES[EServiceType.IMAGE].basePath}/${foundServices[0].id}`);
  }

  return (
    <List>
      {foundServices.map((service) => (
        <Link
          key={service.id}
          href={`/image/${service.id}`}
        >
          <ListItem>
            {service.name || service.id}
          </ListItem>
        </Link>
      ))}
    </List>
  );
}
