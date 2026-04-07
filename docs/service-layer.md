# Service Layer

This document describes backend access conventions for the dashboard.

---

## `fetchService`

`fetchService` is the standard HTTP client for backend calls in server components, server actions, and service files.

```ts
import { fetchService } from '@/utils/fetchService';
```

What it does:
1. Reads `X-Service-Id` and `X-Service-Type` from request headers.
2. Resolves the backend base URL from `config.yml`.
3. Injects bearer auth automatically.
4. Returns a standard `Response` object.

---

## Usage Examples

```ts
// GET
const listResponse = await fetchService('/v1/items');
const items = await listResponse.json();

// POST
const createResponse = await fetchService('/v1/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Foo' }),
});
const created = await createResponse.json();

// PATCH
await fetchService(`/v1/items/${id}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Updated' }),
});

// DELETE
await fetchService(`/v1/items/${id}`, { method: 'DELETE' });
```

Important:
- Do not use plain `fetch` for service backend calls.
- Keep HTTP logic inside service-layer files.

---

## Service Layer Conventions

Structure:

```
src/services/<app>/
  <app>.service.ts   // endpoint functions
  <app>.type.ts      // DTO types
  <app>.forms.ts     // GeneratedForm definitions (optional)
```

Example:

```ts
import { fetchService } from '@/utils/fetchService';
import { ItemDto } from './my-app.type';

const listItems = async (): Promise<ItemDto[]> => {
  const response = await fetchService('/v1/items');
  return response.json();
};

const getItem = async (id: string): Promise<ItemDto> => {
  const response = await fetchService(`/v1/items/${id}`);
  return response.json();
};

export const myAppService = {
  listItems,
  getItem,
};
```

---

## Service Type and Config

### `config.yml`

```yaml
services:
  - type: 'my-app-server'   # must match EServiceType value
    id: 'my-app-main'
    name: 'My App'
    url: 'http://localhost:9000'

defaults:
  my-app-server:
    id: 'my-app-main'
```

`config.yml` is cached at runtime, so config updates usually require a dev-server restart.

---

## Accessing Another Service Instance

For cross-service use cases, resolve and target another default service explicitly.

```ts
import { getDefaultServiceId } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';

const imageServiceId = await getDefaultServiceId(EServiceType.IMAGE);

const response = await fetchService('/v1/images', {
  headers: {
    'X-Service-Id': imageServiceId,
    'X-Service-Type': EServiceType.IMAGE,
  },
});
```

---

## Auth and Tokens

`fetchService` already applies auth for normal backend calls.

For special cases, use:

```ts
import { getAccessToken } from '@/utils/getAccessToken';

const token = await getAccessToken();
```

---

## Key Files

| File | Purpose |
|---|---|
| `src/utils/fetchService.ts` | service-aware HTTP client |
| `src/utils/configuration.utils.ts` | reads YAML config and resolves service IDs |
| `src/utils/configuration.type.ts` | service enum and config types |
| `src/utils/getAccessToken.ts` | server-side token source |
| `src/utils/getServiceLocalUrl.ts` | service-local URL builder |
| `src/constants/auth-options.ts` | NextAuth/Keycloak setup |
