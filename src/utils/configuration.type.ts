export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
  DATATABLE = 'datatable',
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

export type TServiceConfiguration = TCustomerCommunicationServiceConfiguration | TDatatableServiceConfiguration;

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
};
