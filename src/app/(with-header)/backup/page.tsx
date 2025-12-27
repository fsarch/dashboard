import { getServiceConfiguration } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { redirect } from 'next/navigation';
import { APPS } from '@/constants/apps';

export default async function Home() {
  const foundService = await getServiceConfiguration(EServiceType.BACKUP);

  if (foundService) {
    return redirect(`${APPS[EServiceType.BACKUP].basePath}/${foundService.id}`)
  }

  return (
    <main>
      Backup
    </main>
  )
}

