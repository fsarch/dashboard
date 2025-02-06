export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
  DATATABLE = 'datatable',
  PIM = 'product',
  IMAGE = 'image',
}

export type TCustomerCommunicationServiceConfiguration = {
  id: string;
  type: EServiceType.CUSTOMER_COMMUNICATION,
  url: string;
}

export type TDatatableServiceConfiguration = {
  id: string;
  type: EServiceType.DATATABLE,
  url: string;
}

export type TProductServiceConfiguration = {
  id: string;
  type: EServiceType.PIM,
  url: string;
}

export type TImageServiceConfiguration = {
  id: string;
  type: EServiceType.IMAGE,
  url: string;
}

export type TServiceConfiguration = TCustomerCommunicationServiceConfiguration | TDatatableServiceConfiguration | TProductServiceConfiguration | TImageServiceConfiguration;

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
};
