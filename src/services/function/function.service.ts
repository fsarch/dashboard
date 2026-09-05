import { fetchService } from "@/utils/fetchService";
import { 
  FunctionDto, 
  FunctionPatchDto, 
  FunctionVersionDto, 
  WorkerMetaDto,
  ExecutionDto,
  ExecutionListDto,
  ExecutionCreateDto,
  LogDto
} from "@/services/function/function.type";

const listFunctions = async (): Promise<Array<FunctionDto>> => {
  const functionsResponse = await fetchService('/v1/functions');
  const functions = await functionsResponse.json();

  return functions;
};

const getWorkerMeta = async (): Promise<WorkerMetaDto> => {
  const workerMetaResponse = await fetchService('/v1/.meta/worker');
  const workerMeta = await workerMetaResponse.json();

  return workerMeta;
};

const getFunctionVersions = async (functionId: string): Promise<Array<FunctionVersionDto>> => {
  const functionVersionsResponse = await fetchService(`/v1/functions/${functionId}/versions`);
  const functionVersions = await functionVersionsResponse.json();

  return functionVersions;
};

const setFunctionVersionCode = async (functionId: string, code: string): Promise<void> => {
  const functionVersionsResponse = await fetchService(`/v1/functions/${functionId}/versions`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
    }),
  });
  const functionVersions = await functionVersionsResponse.json();

  return functionVersions;
};

const publishFunctionCode = async (functionId: string): Promise<void> => {
  const functionVersionsResponse = await fetchService(`/v1/functions/${functionId}/versions/_actions/publish`, {
    method: 'POST',
  });
  const functionVersions = await functionVersionsResponse.json();

  return functionVersions;
};

const publishFunctionVersion = async (functionId: string, versionId: string): Promise<{ id: string }> => {
  const response = await fetchService(`/v1/functions/${functionId}/versions/${versionId}/_actions/publish`, {
    method: 'POST',
  });

  return response.json();
};

// Function Settings
const patchFunction = async (functionId: string, dto: FunctionPatchDto): Promise<FunctionDto> => {
  const response = await fetchService(`/v1/functions/${functionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  const result = await response.json();
  return result;
};

// Executions
const listExecutions = async (functionId?: string): Promise<ExecutionListDto[]> => {
  const url = functionId 
    ? `/v1/executions/function/${functionId}`
    : '/v1/executions';
  const response = await fetchService(url);
  return response.json();
};

const getExecution = async (executionId: string): Promise<ExecutionDto> => {
  const response = await fetchService(`/v1/executions/${executionId}`);
  return response.json();
};

const createExecution = async (dto: ExecutionCreateDto): Promise<{ id: string }> => {
  const response = await fetchService('/v1/executions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });
  return response.json();
};

// Logs
const listExecutionLogs = async (executionId: string): Promise<LogDto[]> => {
  const response = await fetchService(`/v1/executions/${executionId}/logs`);
  return response.json();
};

export const functionService = {
  listFunctions,
  getFunctionVersions,
  setFunctionVersionCode,
  publishFunctionCode,
  publishFunctionVersion,
  getWorkerMeta,
  patchFunction,
  listExecutions,
  getExecution,
  createExecution,
  listExecutionLogs,
};
