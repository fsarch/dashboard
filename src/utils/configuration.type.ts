export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
  DATATABLE = 'datatable',
  PIM = 'product',
  IMAGE = 'image',
}

export type TCustomerCommunicationServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.CUSTOMER_COMMUNICATION,
  url: string;
}

export type TDatatableServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.DATATABLE,
  url: string;
}

export type TProductServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.PIM,
  url: string;
}

export type TImageServiceConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.IMAGE,
  url: string;
}

export type TServiceConfiguration = TCustomerCommunicationServiceConfiguration | TDatatableServiceConfiguration | TProductServiceConfiguration | TImageServiceConfiguration;

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
};
