import { EContentType } from "@/constants/apps/customer-communication/content-type.enum";

export type TThread = {
  id: string;
  name: string;
  externalId: string;
  customer: {
    id: string;
  };
  communicationProvider: {
    id: string;
    meta?: Record<string, unknown>;
  }
};

export type TMessage = {
  id: string;
  externalId: string;
  content: string;
  contentType: {
    id: EContentType;
  };
  customer?: {
    id: string;
  };
  creationTime: string;
};
