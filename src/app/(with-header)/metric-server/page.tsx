import { redirect } from 'next/navigation';
import { getServiceConfigurations } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';

export default async function MetricServerPage() {
  const services = await getServiceConfigurations(EServiceType.METRIC_SERVER);
  
  if (services.length === 0) {
    return redirect('/');
  }
  
  // Redirect to the first metric-server service
  return redirect(`/metric-server/${services[0].id}`);
}
