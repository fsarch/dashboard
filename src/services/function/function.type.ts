export type FunctionDto = {
  id: string;
  name: string;
  externalId: string;
  enableDebugLogging: boolean;
  enableErrorLogging: boolean;
  retentionTimeSeconds: number;
  creationTime: string;
};

export type FunctionCreateDto = {
  name: string;
  externalId?: string;
  enableDebugLogging?: boolean;
  enableErrorLogging?: boolean;
  retentionTimeSeconds?: number;
};

export type FunctionPatchDto = {
  name?: string;
  externalId?: string;
  enableDebugLogging?: boolean;
  enableErrorLogging?: boolean;
  retentionTimeSeconds?: number;
};

export type FunctionVersionDto = {
  id: string;
  functionId: string;
  externalId: string;
  code: string;
  isActive: boolean;
  publishTime: string;
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

// Executions
export type ExecutionDto = {
  id: string;
  functionId: string;
  isSuccess: boolean;
  arguments: object | null;
  response: object | null;
  creationTime: string;
  deletionTime: string | null;
};

export type ExecutionListDto = {
  id: string;
  creationTime: string;
  isSuccess: boolean;
};

export type ExecutionCreateDto = {
  functionId: string;
  isSuccess: boolean;
  arguments: object | null;
  response: object | null;
  logs: string[] | null;
};

// Logs
export type LogDto = {
  id: string;
  executionId: string;
  logLevelId: number;
  message: string;
  data: object | null;
  creationTime: string;
};
