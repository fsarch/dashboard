import ServiceSelectionPage from '@/components/universals/page/ServiceSelectionPage.component';
import { EServiceType } from '@/utils/configuration.type';

export default function CalendarHome() {
  return <ServiceSelectionPage serviceType={EServiceType.CALENDAR} />;
}
