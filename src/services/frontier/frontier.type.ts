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

export type PathRuleCreateDto = {
  name: string;
  path: string;
  cachePolicyId: string;
  domainGroupId: string;
  upstreamGroupId: string;
  order: number;
  corsEnabled?: boolean;
  corsAllowCredentials?: boolean;
  corsAllowedOrigins?: string[];
};

export type PathRuleDto = PathRuleCreateDto & {
  id: string;
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

