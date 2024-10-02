import { EServiceType } from "@/utils/configuration.type";

export const SERVICES: Record<EServiceType, {
  name: string;
  basePath: string;
}> = {
  [EServiceType.CUSTOMER_COMMUNICATION]: {
    name: 'Customer Communication',
    basePath: '/ccm',
  }
};
