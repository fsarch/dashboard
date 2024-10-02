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
    id: number;
  };
  customer?: {
    id: string;
  };
  creationTime: string;
};
