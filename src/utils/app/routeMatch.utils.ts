import memoize from "lodash.memoize";
import { compile, match } from "path-to-regexp";

// shared, memoized route-pattern matcher used to resolve context-specific
// app settings (navigation, floating button, ...) against X-Service-Path
export const createPathMatcher = memoize((route: string) => {
  return match(route);
});

// counterpart to createPathMatcher: builds a concrete path from a route
// pattern + params (see AppRouteCustomResourceProvider) - used to link back
// from a custom-resource reference to its detail page.
export const createPathCompiler = memoize((route: string) => {
  return compile(route);
});
