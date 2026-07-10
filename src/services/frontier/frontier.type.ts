export type DomainGroupCreateDto = {
  name: string;
};

export type DomainGroupDto = DomainGroupCreateDto & {
  id: string;
};

export type DomainCreateDto = {
  domainName: string;
};

export type DomainDto = DomainCreateDto & {
  id: string;
  domainGroupId: string;
};

export type CachePolicyCreateDto = {
  name: string;
  enableCacheTags: boolean;
  cacheTagsHeader: string;
  defaultTTL: number;
  minTTL: number;
  maxTTL: number;
  divergenceCookies: string[];
  divergenceHeaders: string[];
  divergenceQueryParameters: string[];
  enableStaleWhileError: boolean;
  staleWhileErrorTime: number;
  enableStaleWhileRevalidate: boolean;
  staleWhileRevalidateTime: number;
};

export type CachePolicyUpdateDto = CachePolicyCreateDto;

export type CachePolicyDto = CachePolicyCreateDto & {
  id: string;
};

export type CorsPolicyCreateDto = {
  name: string;
  enabled?: boolean;
  allowCredentials?: boolean;
  allowedOrigins?: string[];
};

export type CorsPolicyUpdateDto = {
  name?: string;
  enabled?: boolean;
  allowCredentials?: boolean;
  allowedOrigins?: string[];
};

export type CorsPolicyDto = {
  id: string;
  name: string;
  enabled?: boolean;
  allowCredentials?: boolean;
  allowedOrigins?: string[];
};

export type LogPolicyCreateDto = {
  name: string;
  enabled?: boolean;
  retentionTimeSeconds?: number;
};

export type LogPolicyUpdateDto = {
  name?: string;
  enabled?: boolean;
  retentionTimeSeconds?: number;
};

export type LogPolicyDto = {
  id: string;
  name: string;
  enabled?: boolean;
  retentionTimeSeconds?: number;
};

export type RequestLogListQuery = {
  pathRuleId?: string;
  logPolicyId?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
};

export type RequestLogDto = {
  id?: string;
  domainGroupId?: string;
  pathRuleId?: string;
  logPolicyId?: string;
  incomingMethod?: string;
  incomingUrl?: string;
  incomingHeaders?: Record<string, unknown>;
  upstreamMethod?: string;
  upstreamUrl?: string;
  upstreamHeaders?: Record<string, unknown>;
  responseStatusCode?: number;
  requestTimeMs?: number;
  createdAt?: string;
};

export type PathRuleCreateDto = {
  name: string;
  path: string;
  cachePolicyId: string;
  upstreamGroupId: string;
  order: number;
  corsPolicyId?: string;
  logPolicyId?: string;
};

export type PathRuleUpdateDto = {
  name?: string;
  path?: string;
  cachePolicyId?: string;
  upstreamGroupId?: string;
  order?: number;
  corsPolicyId?: string;
  logPolicyId?: string;
  preHookId?: string | null;
  postHookId?: string | null;
};

export type PathRuleDto = {
  id: string;
  name: string;
  path: string;
  cachePolicyId: string;
  upstreamGroupId: string;
  order: number;
  corsPolicyId?: string;
  logPolicyId?: string;
  preHookId?: string | null;
  postHookId?: string | null;
};

export type UpstreamGroupCreateDto = {
  name: string;
};

export type UpstreamGroupUpdateDto = {
  name?: string;
};

export type UpstreamGroupDto = UpstreamGroupCreateDto & {
  id: string;
  domainGroupId: string;
};

export type UpstreamSslOptionsDto = {
  sslVerify?: boolean;
};

export type UpstreamCreateDto = {
  name: string;
  host: string;
  port: number;
  path: string;
  protocol?: 'http' | 'https';
  sslOptions?: UpstreamSslOptionsDto;
};

export type UpstreamUpdateDto = {
  name?: string;
  host?: string;
  port?: number;
  path?: string;
  protocol?: 'http' | 'https';
  sslOptions?: UpstreamSslOptionsDto;
};

export type UpstreamDto = UpstreamCreateDto & {
  id: string;
  upstreamGroupId: string;
};

// --- Hooks ---

export type HookCreateDto = {
  name: string;
  functionId: string;
};

export type HookUpdateDto = {
  name?: string;
  functionId?: string;
};

export type HookDto = {
  id: string;
  name: string;
  functionId: string;
};
