export enum EShortCodeType {
  MATERIAL = '31a423de-c55a-4ce5-a075-ab8d1f1b1f7d',
  PART = '9fc2a667-e6ca-4cb7-8a36-ea5ed6d2d2c2',
}

export type TShortCode = {
  id: string;
  code: string;
  shortCodeTypeId: EShortCodeType;
};

export type TShortCodeCreate = {
  name: string;
};
