import { fetchService } from "@/utils/fetchService";
import {
  TClaimDto,
  TCreateClaimDto,
  TApproveClaimDto,
  TPaginationResultDto,
  TPaginationParams,
} from "./bot-protection.type";

// Claims
const listClaims = async (
  params: TPaginationParams,
  serviceId: string
): Promise<TPaginationResultDto<TClaimDto>> => {
  const response = await fetchService(
    `/claims?page=${params.page}&pageSize=${params.pageSize}`,
    undefined,
    { serviceId }
  );
  return response.json();
};

const getClaimById = async (
  claimId: string,
  serviceId: string
): Promise<TClaimDto> => {
  const response = await fetchService(`/claims/${claimId}`, undefined, {
    serviceId,
  });
  return response.json();
};

const createClaim = async (
  dto: TCreateClaimDto,
  serviceId: string
): Promise<void> => {
  await fetchService(`/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
};

const approveClaim = async (
  claimId: string,
  dto: TApproveClaimDto,
  serviceId: string
): Promise<void> => {
  await fetchService(`/claims/${claimId}/_actions/approve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  }, { serviceId });
};

export const botProtectionService = {
  // Claims
  listClaims,
  getClaimById,
  createClaim,
  approveClaim,
};
