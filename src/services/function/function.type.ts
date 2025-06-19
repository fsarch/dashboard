export type FunctionDto = {
  id: string;
  name: string;
};

export type FunctionVersionDto = {
  id: string;
  name: string;
  code: string;
  isActive?: boolean;
  creationTime: string;
};

export type WorkerMetaApiDto = {
  [key: string]: {
    type: 'pdf-server';
  };
};

export type WorkerMetaDto = {
  api: WorkerMetaApiDto;
};
