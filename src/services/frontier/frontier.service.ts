import { fetchService } from '@/utils/fetchService';
import {
  CachePolicyCreateDto,
  CachePolicyDto,
  CachePolicyUpdateDto,
  CorsPolicyCreateDto,
  CorsPolicyDto,
  CorsPolicyUpdateDto,
  DomainCreateDto,
  DomainDto,
  DomainGroupCreateDto,
  DomainGroupDto,
  HookCreateDto,
  HookDto,
  HookUpdateDto,
  LogPolicyCreateDto,
  LogPolicyDto,
  LogPolicyUpdateDto,
  PathRuleCreateDto,
  PathRuleDto,
  PathRuleUpdateDto,
  RequestLogDto,
  RequestLogListQuery,
  UpstreamCreateDto,
  UpstreamDto,
  UpstreamGroupCreateDto,
  UpstreamGroupDto,
  UpstreamGroupUpdateDto,
  UpstreamUpdateDto,
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
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/path-rules/${pathRuleId}`);
  if (!response.ok) return null;
  return response.json();
};

const createPathRule = async (domainGroupId: string, data: PathRuleCreateDto): Promise<PathRuleDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/path-rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const updatePathRule = async (domainGroupId: string, id: string, data: PathRuleUpdateDto): Promise<PathRuleDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/path-rules/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deletePathRule = async (domainGroupId: string, id: string): Promise<void> => {
  await fetchService(`/v1/domain-groups/${domainGroupId}/path-rules/${id}`, {
    method: 'DELETE',
  });
};

// --- CORS Policies ---

const listCorsPolicies = async (domainGroupId: string): Promise<CorsPolicyDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cors-policies`);
  return response.json();
};

const getCorsPolicy = async (domainGroupId: string, corsPolicyId: string): Promise<CorsPolicyDto | null> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cors-policies/${corsPolicyId}`);
  if (!response.ok) return null;
  return response.json();
};

const createCorsPolicy = async (domainGroupId: string, data: CorsPolicyCreateDto): Promise<CorsPolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cors-policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const updateCorsPolicy = async (domainGroupId: string, id: string, data: CorsPolicyUpdateDto): Promise<CorsPolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/cors-policies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteCorsPolicy = async (domainGroupId: string, id: string): Promise<void> => {
  await fetchService(`/v1/domain-groups/${domainGroupId}/cors-policies/${id}`, {
    method: 'DELETE',
  });
};

// --- Log Policies ---

const listLogPolicies = async (domainGroupId: string): Promise<LogPolicyDto[]> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/log-policies`);
  return response.json();
};

const getLogPolicy = async (domainGroupId: string, logPolicyId: string): Promise<LogPolicyDto | null> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/log-policies/${logPolicyId}`);
  if (!response.ok) return null;
  return response.json();
};

const createLogPolicy = async (domainGroupId: string, data: LogPolicyCreateDto): Promise<LogPolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/log-policies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const updateLogPolicy = async (domainGroupId: string, id: string, data: LogPolicyUpdateDto): Promise<LogPolicyDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/log-policies/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteLogPolicy = async (domainGroupId: string, id: string): Promise<void> => {
  await fetchService(`/v1/domain-groups/${domainGroupId}/log-policies/${id}`, {
    method: 'DELETE',
  });
};

// --- Request Logs ---

const listRequestLogs = async (
  domainGroupId: string,
  query?: RequestLogListQuery,
): Promise<RequestLogDto[]> => {
  const params = new URLSearchParams();

  if (query?.pathRuleId) params.set('pathRuleId', query.pathRuleId);
  if (query?.logPolicyId) params.set('logPolicyId', query.logPolicyId);
  if (query?.from) params.set('from', query.from);
  if (query?.to) params.set('to', query.to);
  if (query?.limit !== undefined) params.set('limit', `${query.limit}`);
  if (query?.offset !== undefined) params.set('offset', `${query.offset}`);

  const queryString = params.toString();
  const path = queryString
    ? `/v1/domain-groups/${domainGroupId}/request-logs?${queryString}`
    : `/v1/domain-groups/${domainGroupId}/request-logs`;

  const response = await fetchService(path);
  return response.json();
};

const getRequestLog = async (
  domainGroupId: string,
  requestLogId: string,
  query?: RequestLogListQuery,
): Promise<RequestLogDto | null> => {
  const requestLogAbsoluteIndexPrefix = '__absolute-';
  const isAbsoluteIndexReference = requestLogId.startsWith(requestLogAbsoluteIndexPrefix);

  if (isAbsoluteIndexReference) {
    const absoluteIndex = Number.parseInt(requestLogId.replace(requestLogAbsoluteIndexPrefix, ''), 10);
    if (Number.isNaN(absoluteIndex) || absoluteIndex < 0) {
      return null;
    }

    const absoluteIndexedRequestLogs = await listRequestLogs(domainGroupId, {
      ...query,
      limit: 1,
      offset: absoluteIndex,
    });

    return absoluteIndexedRequestLogs[0] ?? null;
  }

  const requestLogs = await listRequestLogs(domainGroupId, {
    ...query,
    limit: query?.limit ?? 100,
    offset: query?.offset ?? 0,
  });

  return requestLogs.find((requestLog, index) => {
    if (requestLog.id) {
      return requestLog.id === requestLogId;
    }

    return `${requestLogAbsoluteIndexPrefix}${index + (query?.offset ?? 0)}` === requestLogId;
  }) ?? null;
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

const getUpstreamGroupById = async (domainGroupId: string, upstreamGroupId: string): Promise<UpstreamGroupDto | null> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}`);
  if (!response.ok) return null;
  return response.json();
};

const updateUpstreamGroup = async (domainGroupId: string, upstreamGroupId: string, data: UpstreamGroupUpdateDto): Promise<UpstreamGroupDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteUpstreamGroup = async (domainGroupId: string, upstreamGroupId: string): Promise<void> => {
  await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}`, {
    method: 'DELETE',
  });
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

const getUpstreamById = async (domainGroupId: string, upstreamGroupId: string, upstreamId: string): Promise<UpstreamDto | null> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream/${upstreamId}`);
  if (!response.ok) return null;
  return response.json();
};

const updateUpstream = async (domainGroupId: string, upstreamGroupId: string, upstreamId: string, data: UpstreamUpdateDto): Promise<UpstreamDto> => {
  const response = await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream/${upstreamId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteUpstream = async (domainGroupId: string, upstreamGroupId: string, upstreamId: string): Promise<void> => {
  await fetchService(`/v1/domain-groups/${domainGroupId}/upstream-groups/${upstreamGroupId}/upstream/${upstreamId}`, {
    method: 'DELETE',
  });
};

// --- Hooks ---

const listHooks = async (): Promise<HookDto[]> => {
  const response = await fetchService('/v1/hooks');
  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

const getHook = async (hookId: string): Promise<HookDto | null> => {
  const response = await fetchService(`/v1/hooks/${hookId}`);
  if (!response.ok) return null;
  return response.json();
};

const createHook = async (data: HookCreateDto): Promise<HookDto> => {
  const response = await fetchService('/v1/hooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const updateHook = async (id: string, data: HookUpdateDto): Promise<HookDto> => {
  const response = await fetchService(`/v1/hooks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return response.json();
};

const deleteHook = async (id: string): Promise<void> => {
  await fetchService(`/v1/hooks/${id}`, {
    method: 'DELETE',
  });
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
  updatePathRule,
  deletePathRule,
  listCorsPolicies,
  getCorsPolicy,
  createCorsPolicy,
  updateCorsPolicy,
  deleteCorsPolicy,
  listLogPolicies,
  getLogPolicy,
  createLogPolicy,
  updateLogPolicy,
  deleteLogPolicy,
  listRequestLogs,
  getRequestLog,
  listUpstreamGroups,
  getUpstreamGroup,
  getUpstreamGroupById,
  createUpstreamGroup,
  updateUpstreamGroup,
  deleteUpstreamGroup,
  listUpstreams,
  getUpstream,
  getUpstreamById,
  createUpstream,
  updateUpstream,
  deleteUpstream,
  listHooks,
  getHook,
  createHook,
  updateHook,
  deleteHook,
};

