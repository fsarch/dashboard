import { fetchService } from '@/utils/fetchService';
import {
  CachePolicyCreateDto,
  CachePolicyDto,
  CachePolicyUpdateDto,
  DomainCreateDto,
  DomainDto,
  DomainGroupCreateDto,
  DomainGroupDto,
  PathRuleCreateDto,
  PathRuleDto,
  UpstreamCreateDto,
  UpstreamDto,
  UpstreamGroupCreateDto,
  UpstreamGroupDto,
} from '@/services/frontier/frontier.type';

const findById = <T extends { id: string }>(entries: T[], id: string): T | null => {
  return entries.find((entry) => entry.id === id) ?? null;
};

// --- Domain Groups ---

const listDomainGroups = async (): Promise<DomainGroupDto[]> => {
  const response = await fetchService('/v1/domain-groups');
  return response.json();
};

const getDomainGroup = async (domainGroupId: string): Promise<DomainGroupDto | null> => {
  const domainGroups = await listDomainGroups();
  return findById(domainGroups, domainGroupId);
};

const createDomainGroup = async (data: DomainGroupCreateDto): Promise<DomainGroupDto> => {
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

const getDomain = async (domainGroupId: string, domainId: string): Promise<DomainDto | null> => {
  const domains = await listDomains(domainGroupId);
  return findById(domains, domainId);
};

const createDomain = async (domainGroupId: string, data: DomainCreateDto): Promise<DomainDto> => {
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

const getCachePolicy = async (domainGroupId: string, cachePolicyId: string): Promise<CachePolicyDto | null> => {
  const cachePolicies = await listCachePolicies(domainGroupId);
  return findById(cachePolicies, cachePolicyId);
};

const createCachePolicy = async (domainGroupId: string, data: CachePolicyCreateDto): Promise<CachePolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cache-policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const updateCachePolicy = async (domainGroupId: string, id: string, data: CachePolicyUpdateDto): Promise<CachePolicyDto> => {
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

const getPathRule = async (domainGroupId: string, pathRuleId: string): Promise<PathRuleDto | null> => {
  const pathRules = await listPathRules(domainGroupId);
  return findById(pathRules, pathRuleId);
};

const createPathRule = async (domainGroupId: string, data: PathRuleCreateDto): Promise<PathRuleDto> => {
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

const getUpstreamGroup = async (domainGroupId: string, upstreamGroupId: string): Promise<UpstreamGroupDto | null> => {
  const upstreamGroups = await listUpstreamGroups(domainGroupId);
  return findById(upstreamGroups, upstreamGroupId);
};

const createUpstreamGroup = async (domainGroupId: string, data: UpstreamGroupCreateDto): Promise<UpstreamGroupDto> => {
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

const getUpstream = async (domainGroupId: string, upstreamGroupId: string, upstreamId: string): Promise<UpstreamDto | null> => {
  const upstreams = await listUpstreams(domainGroupId, upstreamGroupId);
  return findById(upstreams, upstreamId);
};

const createUpstream = async (domainGroupId: string, upstreamGroupId: string, data: UpstreamCreateDto): Promise<UpstreamDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const frontierService = {
  listDomainGroups,
  getDomainGroup,
  createDomainGroup,
  listDomains,
  getDomain,
  createDomain,
  listCachePolicies,
  getCachePolicy,
  createCachePolicy,
  updateCachePolicy,
  listPathRules,
  getPathRule,
  createPathRule,
  listUpstreamGroups,
  getUpstreamGroup,
  createUpstreamGroup,
  listUpstreams,
  getUpstream,
  createUpstream,
};

