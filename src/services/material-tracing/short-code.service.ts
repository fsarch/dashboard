import { fetchService } from "@/utils/fetchService";
import { TShortCode } from "@/services/material-tracing/short-code.type";

const listShortCodes = async (): Promise<Array<TShortCode>> => {
  const shortCodesResponse = await fetchService('/v1/short-codes');
  const shortCodes = await shortCodesResponse.json();

  return shortCodes;
};

const getShortCode = async (code: string): Promise<TShortCode> => {
  const shortCodeResponse = await fetchService(`/v1/short-codes/${code}`);
  const shortCode = await shortCodeResponse.json();

  return shortCode;
};

export const shortCodeService = {
  listShortCodes,
  getShortCode,
};
