import ServiceSelectionPage from '@/components/universals/page/ServiceSelectionPage.component';
import { EServiceType } from '@/utils/configuration.type';

export default function Home() {
  return <ServiceSelectionPage serviceType={EServiceType.IMAGE} />;
}
