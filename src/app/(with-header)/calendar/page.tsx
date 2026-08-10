import { EServiceType } from '@/utils/configuration.type';
import ServiceSelectionPage from '@/components/universals/page/ServiceSelectionPage.component';

export default function CalendarHome() {
  return (
    <ServiceSelectionPage serviceType={EServiceType.CALENDAR} />
  );
}