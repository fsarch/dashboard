import { fetchService } from "@/utils/fetchService";
import {
  CreateFunctionDto,
  FunctionGatewayDto,
  FunctionGatewayListResponse,
  ExecuteFunctionResponse,
  ExecuteFunctionRequest
} from "./function-gateway.type";

const listFunctions = async (page: number = 1, pageSize: number = 10): Promise<FunctionGatewayListResponse> => {
  const response = await fetchService(`/functions?page=${page}&pageSize=${pageSize}`);
  const data = await response.json();
  return data;
};

const createFunction = async (createFunctionDto: CreateFunctionDto): Promise<FunctionGatewayDto> => {
  const response = await fetchService('/functions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(createFunctionDto),
  });
  const data = await response.json();
  return data;
};

const getFunction = async (functionId: string): Promise<FunctionGatewayDto> => {
  const response = await fetchService(`/functions/${functionId}`);
  const data = await response.json();
  return data;
};

const deleteFunction = async (functionId: string): Promise<void> => {
  await fetchService(`/functions/${functionId}`, {
    method: 'DELETE',
  });
};

const executeFunction = async (
  functionId: string,
  request?: ExecuteFunctionRequest
): Promise<ExecuteFunctionResponse> => {
  const method = request?.method || 'GET';
  const body = request?.input ? JSON.stringify(request.input) : undefined;

  const response = await fetchService(`/functions/${functionId}/_actions/execute`, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });
  const data = await response.json();
  return data;
};

export const functionGatewayService = {
  listFunctions,
  createFunction,
  getFunction,
  deleteFunction,
  executeFunction,
};
