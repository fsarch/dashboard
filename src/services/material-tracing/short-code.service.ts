import { fetchService } from "@/utils/fetchService";
import { TShortCode } from "@/services/material-tracing/short-code.type";

const listShortCodes = async (): Promise<Array<TShortCode>> => {
  const shortCodesResponse = await fetchService('/v1/short-codes');
  const shortCodes = await shortCodesResponse.json();

  return shortCodes;
};

export const shortCodeService = {
  listShortCodes,
};
