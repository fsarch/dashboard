export type TPart = {
  id: string;
  name: string;
  partTypeId: string;
  externalId?: string;
  amount: number;
  hint?: string;
  checkoutTime?: string;
  archiveTime?: string;
};
