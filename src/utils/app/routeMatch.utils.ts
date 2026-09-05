import memoize from "lodash.memoize";
import { match } from "path-to-regexp";

// shared, memoized route-pattern matcher used to resolve context-specific
// app settings (navigation, floating button, ...) against X-Service-Path
export const createPathMatcher = memoize((route: string) => {
  return match(route);
});
