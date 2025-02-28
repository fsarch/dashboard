export enum EShortCodeType {
  MATERIAL = '31a423de-c55a-4ce5-a075-ab8d1f1b1f7d',
}

export type TShortCode = {
  id: string;
  code: string;
  shortCodeTypeId: EShortCodeType;
};

export type TShortCodeCreate = {
  name: string;
};
