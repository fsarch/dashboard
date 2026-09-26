import { redirect } from 'next/navigation';
import { EServiceType } from '@/utils/configuration.type';
import { getServiceConfigurations } from '@/utils/configuration.utils';

export default async function DblightHome() {
  const services = await getServiceConfigurations(EServiceType.DBLIGHT);

  if (services.length === 0) {
    return redirect('/');
  }

  return redirect(`/dblight/${services[0].id}`);
}
