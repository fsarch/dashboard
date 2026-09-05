import { redirect } from 'next/navigation';
import { getServiceConfigurations } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';

export default async function DblightHome() {
  const services = await getServiceConfigurations(EServiceType.DBLIGHT);

  if (services.length === 0) {
    return redirect('/');
  }

  return redirect(`/dblight/${services[0].id}`);
}
