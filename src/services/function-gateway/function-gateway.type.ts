export interface CreateFunctionDto {
  functionId: string;
  name?: string;
}

export interface FunctionGatewayDto {
  id: string;
  functionId: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FunctionGatewayListResponse {
  data: FunctionGatewayDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ExecuteFunctionResponse {
  result: any;
  status: 'success' | 'error';
  message?: string;
}

export interface ExecuteFunctionRequest {
  input?: any;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
}
