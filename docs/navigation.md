# Navigation

This document explains the full navigation system used in the dashboard.
It is written for both AI coding agents and human developers.

---

## How Navigation Works

Sidebar navigation is defined centrally in `src/constants/apps.ts`.
Pages do not hardcode sidebar items in JSX. `DefaultPage` resolves and renders navigation automatically.

### Runtime Flow

```
Browser request
  -> src/proxy.ts
     - sets X-Service-Type (example: "frontier-server")
     - sets X-Service-Id   (example: "frontier-main")
     - sets X-Service-Path (example: "/domain-group/abc123")
        -> DefaultPage.component.tsx
           -> navigationUtils.getNavigationItems(APPS[serviceType], 'sidebar')
              -> route match in APPS[serviceType].routes
                 -> resolved sidebar items
```

`X-Service-Path` is the path inside one service instance (without `/<serviceType>/<serviceId>`).

---

## TypeScript Model

Defined in `src/constants/app.type.ts`:

```ts
type AppNavigationItem = {
  name: string;
  icon?: TIcon;
  path: string | { $type: 'jsonata'; value: string };
};

type AppNavigation = {
  id: string;
  position: 'sidebar' | 'sidebar-bottom';
  items: Array<AppNavigationItem>;
};

type AppDefinitionType = {
  name: string;
  basePath: string;
  navigation?: Array<AppNavigationItem>;
  navigations?: Array<AppNavigation>;
  routes?: {
    [routePattern: string]: {
      navigation?: Array<AppNavigationItem>;
      navigations?: Array<AppNavigation>;
    };
  };
};
```

---

## Static Navigation

Use `navigation` for simple apps:

```ts
[EServiceType.EMAIL_SERVER]: {
  name: 'Email Server',
  basePath: '/email',
  navigation: [{
    name: 'Accounts',
    path: '/',
    icon: 'layer-group',
  }],
},
```

Paths are service-local. `'/'` resolves to `/<serviceType>/<serviceId>`.

---

## Context Navigation with `routes`

Use `routes` when sidebar items must change by current sub-route.

```ts
routes: {
  '/domain-group/:domainGroupId{/*path}': {
    navigation: [/* ... */],
  },
},
```

### Matching Rules

- Matching is done in `src/utils/app/navigation.utils.ts` via `path-to-regexp`.
- If multiple patterns match, the last matching definition wins.
- Use `{/*path}` when the config must cover nested pages.

Examples:

| Pattern | Meaning |
|---|---|
| `/catalog/:catalogId` | required path param |
| `/domain-group/:domainGroupId{/*path}` | required param + any nested path |
| `/material-type` | exact route |

---

## Dynamic Paths with JSONata

When a sidebar link depends on route params, use JSONata:

```ts
{
  name: 'Overview',
  icon: 'layer-group',
  path: {
    $type: 'jsonata',
    value: "'/domain-group/' & params.domainGroupId",
  },
}
```

JSONata context for navigation items:

| Variable | Description |
|---|---|
| `params.*` | params captured by matching route pattern |

---

## `sidebar` vs `sidebar-bottom`

- `navigation` -> main sidebar only (legacy + simple mode)
- `navigations` -> explicit groups for `sidebar` and `sidebar-bottom`

```ts
navigations: [{
  id: 'main',
  position: 'sidebar',
  items: [{ name: 'Overview', path: '/', icon: 'layer-group' }],
}, {
  id: 'bottom',
  position: 'sidebar-bottom',
  items: [{ name: 'Archive', path: '/archive', icon: 'archive' }],
}],
```

---

## Frontier Example (Current Pattern)

```ts
[EServiceType.FRONTIER]: {
  name: 'Frontier',
  basePath: '/frontier',
  navigation: [{ name: 'Domain Groups', path: '/', icon: 'layer-group' }],
  routes: {
    '/domain-group/:domainGroupId{/*path}': {
      navigation: [{
        name: 'Back to Domain Groups',
        path: '/',
        icon: 'arrow-left',
      }, {
        name: 'Overview',
        path: { $type: 'jsonata', value: "'/domain-group/' & params.domainGroupId" },
        icon: 'layer-group',
      }, {
        name: 'Domains',
        path: { $type: 'jsonata', value: "'/domain-group/' & params.domainGroupId & '/domain'" },
        icon: 'globe',
      }, {
        name: 'Cache Policies',
        path: { $type: 'jsonata', value: "'/domain-group/' & params.domainGroupId & '/cache-policy'" },
        icon: 'database',
      }],
    },
  },
},
```

---

## Common Pitfalls

### 1) Hash links in sidebar (`#section`)

Problem:
`isSelected` compares `X-Service-Path` with item path. Hash fragments are not real service paths.

Rule:
Use real pages (`/domain-group/:id/domain`) instead of hash anchors.

### 2) Missing nested route coverage

Problem:
`'/domain-group/:domainGroupId'` does not cover `/domain-group/x/cache-policy/create`.

Rule:
Use `'/domain-group/:domainGroupId{/*path}'` for context navigation.

### 3) Broken service-local links due to leading slashes

`getServiceLocalUrl` now normalizes leading `/`.
Still, treat paths as service-local and prefer `getServiceLocalUrl(...)` for internal links.

---

## `getServiceLocalUrl` Usage

```ts
import { getServiceLocalUrl } from '@/utils/getServiceLocalUrl';

const createLink = await getServiceLocalUrl(`/domain-group/${domainGroupId}/cache-policy/create`);
const serviceRoot = await getServiceLocalUrl('');
```

`getServiceLocalUrl` is server-only and should be used in server components/actions.

---

## Key Files

| File | Purpose |
|---|---|
| `src/constants/apps.ts` | app definitions and navigation JSON |
| `src/constants/app.type.ts` | navigation type system |
| `src/utils/app/navigation.utils.ts` | route matching + resolved items |
| `src/components/universals/page/DefaultPage.component.tsx` | automatic sidebar rendering |
| `src/components/universals/page/AutoNavigation.component.tsx` | sidebar UI renderer |
| `src/utils/getServiceLocalUrl.ts` | service-local URL builder |
| `src/proxy.ts` | request headers used by navigation |
