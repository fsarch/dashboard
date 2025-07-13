import { fetchService } from "@/utils/fetchService";
import { FunctionDto, FunctionVersionDto, WorkerMetaDto } from "@/services/function/function.type";
import { ReceiptDataDto, PrintJobDto } from "@/services/printer/printer.type";

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

const createReceiptJob = async (
  printerId: string, 
  data: ReceiptDataDto, 
  options?: { externalId?: string }
): Promise<PrintJobDto> => {
  const createJobResponse = await fetchService(`/v1/printers/${printerId}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data,
      externalId: options?.externalId || null,
    }),
  });
  const job = await createJobResponse.json();

  return job;
};

export const functionService = {
  listFunctions,
  getFunctionVersions,
  setFunctionVersionCode,
  publishFunctionCode,
  getWorkerMeta,
  createReceiptJob,
};
