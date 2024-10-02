export enum EServiceType {
  CUSTOMER_COMMUNICATION = 'customer-communication',
}

export type TCustomerCommunicationServiceConfiguration = {
  id: string;
  type: EServiceType.CUSTOMER_COMMUNICATION,
  url: string;
}

export type TServiceConfiguration = TCustomerCommunicationServiceConfiguration;

export type TConfiguration = {
  services: Array<TServiceConfiguration>;
};
