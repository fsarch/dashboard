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

export type PathRuleCreateDto = {
  name: string;
  path: string;
  cachePolicyId: string;
  upstreamGroupId: string;
  order: number;
  corsPolicyId?: string;
};

export type PathRuleUpdateDto = {
  name?: string;
  path?: string;
  cachePolicyId?: string;
  upstreamGroupId?: string;
  order?: number;
  corsPolicyId?: string;
};

export type PathRuleDto = {
  id: string;
  name: string;
  path: string;
  cachePolicyId: string;
  upstreamGroupId: string;
  order: number;
  corsPolicyId?: string;
};

export type UpstreamGroupCreateDto = {
  name: string;
};

export type UpstreamGroupDto = UpstreamGroupCreateDto & {
  id: string;
  domainGroupId: string;
};

export type UpstreamCreateDto = {
  name: string;
  host: string;
  port: number;
  path: string;
};

export type UpstreamDto = UpstreamCreateDto & {
  id: string;
  upstreamGroupId: string;
};
