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
