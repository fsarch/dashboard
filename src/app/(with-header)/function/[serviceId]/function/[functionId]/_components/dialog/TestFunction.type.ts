export type TestFunctionSuccessResultType = {
  isError: false;
  result: unknown;
};

export type TestFunctionErrorResultType = {
  isError: true;
  error: {
    message: string;
    stack: string;
  }
};

export type TestFunctionResultType = TestFunctionSuccessResultType | TestFunctionErrorResultType;
