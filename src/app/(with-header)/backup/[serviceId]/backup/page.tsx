import React from 'react';
import { listBackups } from '@/services/backup';
import { DefaultPage } from "@/components/universals/page/DefaultPage.component";
import LinkListItem from "@/components/universals/list/LinkListItem";
import List from "@/components/universals/list/List";
import { getServiceLocalUrl } from "@/utils/getServiceLocalUrl";
import Link from "next/link";
import Button from "@/components/universals/forms/Button";

export default async function BackupsPage({ params }: { params: Promise<{ serviceId: string }> }) {
  const backups = await listBackups();

  return (
    <DefaultPage>
      <Link href={await getServiceLocalUrl('/backup/create')}>
        <Button type="button">Neues Backup erstellen</Button>
      </Link>

      <List>
        {backups.data.map(async (backup) => (
          <LinkListItem
            key={backup.id}
            href={await getServiceLocalUrl(`/backup/${backup.id}`)}
          >
            {backup.name}
          </LinkListItem>
        ))}
      </List>
    </DefaultPage>
  )
}

