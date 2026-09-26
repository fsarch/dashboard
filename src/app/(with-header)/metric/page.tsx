import { redirect } from 'next/navigation';
import { EServiceType } from '@/utils/configuration.type';
import { getServiceConfigurations } from '@/utils/configuration.utils';

export default async function MetricServerPage() {
  const services = await getServiceConfigurations(EServiceType.METRIC);

  if (services.length === 0) {
    return redirect('/');
  }

  // Redirect to the first metric service
  return redirect(`/metric/${services[0].id}`);
}
