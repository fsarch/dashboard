import { EServiceType } from "@/utils/configuration.type";

export const SERVICES: Record<EServiceType, {
  name: string;
  basePath: string;
}> = {
  [EServiceType.CUSTOMER_COMMUNICATION]: {
    name: 'Customer Communication',
    basePath: '/ccm',
  },
  [EServiceType.DATATABLE]: {
    name: 'Datatable',
    basePath: '/datatable',
  },
  [EServiceType.PIM]: {
    name: 'Product',
    basePath: '/product',
  },
  [EServiceType.IMAGE]: {
    name: 'Image',
    basePath: '/image',
  },
};
