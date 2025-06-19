import { fetchService } from "@/utils/fetchService";
import { FunctionDto, FunctionVersionDto, WorkerMetaDto } from "@/services/function/function.type";

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

export const functionService = {
  listFunctions,
  getFunctionVersions,
  setFunctionVersionCode,
  publishFunctionCode,
  getWorkerMeta,
};
