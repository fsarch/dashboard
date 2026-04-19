import { fetchService } from "@/utils/fetchService";
import { TShortCode } from "@/services/material-tracing/short-code.type";
import type { TPaginationResult } from "./pagination.type";

const listShortCodes = async (options?: {
  skip?: number;
  take?: number;
  search?: string;
}): Promise<TPaginationResult<TShortCode>> => {
  const url = new URL('/v1/short-codes', 'http://localhost');

  if (options?.skip !== undefined) {
    url.searchParams.append('skip', options.skip.toString());
  }

  if (options?.take !== undefined) {
    url.searchParams.append('take', options.take.toString());
  }

  if (options?.search) {
    url.searchParams.append('search', options.search);
  }

  const shortCodesResponse = await fetchService(url.pathname + url.search);
  return await shortCodesResponse.json();
};

const getShortCode = async (code: string): Promise<TShortCode> => {
  const shortCodeResponse = await fetchService(`/v1/short-codes/${code}`);
  const shortCode = await shortCodeResponse.json();

  return shortCode;
};

const createShortCode = async (): Promise<TShortCode> => {
  const shortCodeResponse = await fetchService('/v1/short-codes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({}),
  });
  const shortCode = await shortCodeResponse.json();

  return shortCode;
};

const batchCreateShortCodes = async (amount: number): Promise<{
  shortCodes: Array<TShortCode>;
  failedCount: number;
  errors: Array<string>;
}> => {
  if (amount < 1 || amount > 100) {
    throw new Error('Amount must be between 1 and 100');
  }

  const MAX_CONCURRENT = 5;
  const results: Array<TShortCode> = [];
  const errors: Array<string> = [];

  // Create batches of requests with max 5 concurrent
  for (let i = 0; i < amount; i += MAX_CONCURRENT) {
    const batchSize = Math.min(MAX_CONCURRENT, amount - i);
    const batchPromises = Array.from({ length: batchSize }, () => createShortCode());

    const batchResults = await Promise.allSettled(batchPromises);

    batchResults.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        errors.push(`Creation ${i + index + 1} failed: ${result.reason?.message || 'Unknown error'}`);
      }
    });
  }

  return {
    shortCodes: results,
    failedCount: amount - results.length,
    errors
  };
};

export const shortCodeService = {
  listShortCodes,
  getShortCode,
  createShortCode,
  batchCreateShortCodes,
};
