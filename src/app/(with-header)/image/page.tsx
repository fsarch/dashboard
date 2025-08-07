import { getServiceConfigurations } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";
import { redirect } from "next/navigation";
import { APPS } from "@/constants/apps";
import List from "@/components/universals/list/List";
import Link from "next/link";
import ListItem from "@/components/universals/list/ListItem";
import styles from "@/components/universals/page/DefaultPage.module.scss";
import DefaultPageHeader from "@/components/universals/page/DefaultPageHeader.component";
import React from "react";

export default async function Home() {
  const foundServices = await getServiceConfigurations(EServiceType.IMAGE);

  if (foundServices.length === 1) {
    return redirect(`${APPS[EServiceType.IMAGE].basePath}/${foundServices[0].id}`);
  }

  return (
    <div>
      <DefaultPageHeader
        className={styles.header}
        title="Image Server"
      />
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
    </div>
  );
}
