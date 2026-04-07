import { fetchService } from '@/utils/fetchService';
import {
  CachePolicyDto,
  DomainDto,
  DomainGroupDto,
  PathRuleDto,
  UpstreamDto,
  UpstreamGroupDto,
} from '@/services/frontier/frontier.type';

// --- Domain Groups ---

const listDomainGroups = async (): Promise<DomainGroupDto[]> => {
  const response = await fetchService('/v1/domain-groups');
  return response.json();
};

const createDomainGroup = async (data: { name: string }): Promise<DomainGroupDto> => {
  const response = await fetchService('/v1/domain-groups', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// --- Domains ---

const listDomains = async (domainGroupId: string): Promise<DomainDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/domain`);
  return response.json();
};

const createDomain = async (domainGroupId: string, data: { domainName: string }): Promise<DomainDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/domain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// --- Cache Policies ---

const listCachePolicies = async (domainGroupId: string): Promise<CachePolicyDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cache-policies`);
  return response.json();
};

const createCachePolicy = async (domainGroupId: string, data: Omit<CachePolicyDto, 'id'>): Promise<CachePolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cache-policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const updateCachePolicy = async (domainGroupId: string, id: string, data: Partial<Omit<CachePolicyDto, 'id'>>): Promise<CachePolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cache-policies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// --- Path Rules ---

const listPathRules = async (domainGroupId: string): Promise<PathRuleDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/path-rules`);
  return response.json();
};

const createPathRule = async (domainGroupId: string, data: Omit<PathRuleDto, 'id'>): Promise<PathRuleDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/path-rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// --- Upstream Groups ---

const listUpstreamGroups = async (domainGroupId: string): Promise<UpstreamGroupDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups`);
  return response.json();
};

const createUpstreamGroup = async (domainGroupId: string, data: { name: string }): Promise<UpstreamGroupDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

// --- Upstreams ---

const listUpstreams = async (domainGroupId: string, upstreamGroupId: string): Promise<UpstreamDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream`);
  return response.json();
};

const createUpstream = async (domainGroupId: string, upstreamGroupId: string, data: Omit<UpstreamDto, 'id' | 'upstreamGroupId'>): Promise<UpstreamDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const frontierService = {
  listDomainGroups,
  createDomainGroup,
  listDomains,
  createDomain,
  listCachePolicies,
  createCachePolicy,
  updateCachePolicy,
  listPathRules,
  createPathRule,
  listUpstreamGroups,
  createUpstreamGroup,
  listUpstreams,
  createUpstream,
};

