export type DomainGroupDto = {
  id: string;
  name: string;
};

export type DomainDto = {
  id: string;
  domainName: string;
  domainGroupId: string;
};

export type CachePolicyDto = {
  id: string;
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

export type PathRuleDto = {
  id: string;
  name: string;
  path: string;
  cachePolicyId: string;
  domainGroupId: string;
  upstreamGroupId: string;
  order: number;
};

export type UpstreamGroupDto = {
  id: string;
  name: string;
  domainGroupId: string;
};

export type UpstreamDto = {
  id: string;
  name: string;
  host: string;
  port: number;
  path: string;
  upstreamGroupId: string;
};

