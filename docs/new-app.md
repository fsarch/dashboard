# Add a New App

Step-by-step guide for adding a new embedded app to the dashboard.

---

## 1) Register a Service Type

File: `src/utils/configuration.type.ts`

```ts
export enum EServiceType {
  // ...existing values...
  MY_APP = 'my-app-server', // must match `type` in config.yml
}

export type TMyAppConfiguration = {
  id: string;
  name?: string;
  type: EServiceType.MY_APP;
  url: string;
  // optional extra fields (for some services), e.g. worker_url
};

export type TServiceConfiguration =
  // ...existing unions...
  | TMyAppConfiguration;
```

---

## 2) Register the App in `APPS`

File: `src/constants/apps.ts`

```ts
[EServiceType.MY_APP]: {
  name: 'My App',
  basePath: '/my-app',
  navigation: [{
    name: 'Overview',
    path: '/',
    icon: 'layer-group',
  }],
},
```

Notes:
- `basePath` must be unique.
- `src/proxy.ts` uses app base paths to derive service headers.

---

## 3) Add Dashboard Tile (Optional)

File: `src/utils/app/app.utils.ts`

```ts
{
  icon: 'puzzle-piece',
  name: 'My App',
  path: '/my-app',
},
```

---

## 4) Create Routes

### 4.1 Root route (redirect or service list)

File: `src/app/(with-header)/my-app/page.tsx`

```tsx
import { getServiceConfigurations } from '@/utils/configuration.utils';
import { EServiceType } from '@/utils/configuration.type';
import { APPS } from '@/constants/apps';
import { redirect } from 'next/navigation';

export default async function MyAppHome() {
  const services = await getServiceConfigurations(EServiceType.MY_APP);

  if (services.length === 1) {
    return redirect(`${APPS[EServiceType.MY_APP].basePath}/${services[0].id}`);
  }

  return <div>{/* service list */}</div>;
}
```

### 4.2 Service root route

File: `src/app/(with-header)/my-app/[serviceId]/page.tsx`

```tsx
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import { createAutomaticMetadata } from '@/utils/createAutomaticMetadata';

export const generateMetadata = createAutomaticMetadata();

export default async function MyAppServicePage() {
  return (
    <DefaultPage>
      {/* content */}
    </DefaultPage>
  );
}
```

### 4.3 Sub-routes

Pattern:
`src/app/(with-header)/my-app/[serviceId]/<resource>/page.tsx`

---

## 5) Create Service Layer

Files:
- `src/services/my-app/my-app.service.ts`
- `src/services/my-app/my-app.type.ts`

```ts
import { fetchService } from '@/utils/fetchService';
import { ItemDto } from './my-app.type';

const listItems = async (): Promise<ItemDto[]> => {
  const response = await fetchService('/v1/items');
  return response.json();
};

export const myAppService = { listItems };
```

Important:
- Use `fetchService`, not `fetch`.
- Keep endpoint logic in service files, not in page components.

---

## 6) Add Forms (If Needed)

Prefer `GeneratedForm` for create/update/delete flows.
See `docs/generated-form.md`.

File: `src/services/my-app/my-app.forms.ts`

```ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const MY_APP_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [{ id: 'name', $type: 'text', label: 'Name' }],
  initialValues: { name: '' },
  endpoint: {
    path: '/v1/items',
    method: 'POST',
    body: { $type: 'jsonata', value: 'form' },
  },
  postEndpointActions: [{
    $type: 'redirect',
    url: { $type: 'jsonata', value: "service.localPath & '/item/' & response.body.id" },
  }],
  buttons: { submitButtonText: 'Create' },
};
```

---

## 7) Update `config.yml`

```yaml
services:
  - type: 'my-app-server'
    id: 'my-app-main'
    name: 'My App (Dev)'
    url: 'http://localhost:9000'

defaults:
  my-app-server:
    id: 'my-app-main'
```

---

## Checklist

- [ ] Add `EServiceType.MY_APP` in `configuration.type.ts`
- [ ] Add `TMyAppConfiguration` and union it into `TServiceConfiguration`
- [ ] Add app entry in `src/constants/apps.ts`
- [ ] Optionally add dashboard tile in `src/utils/app/app.utils.ts`
- [ ] Add root route in `src/app/(with-header)/my-app/page.tsx`
- [ ] Add service root in `src/app/(with-header)/my-app/[serviceId]/page.tsx`
- [ ] Add service layer in `src/services/my-app/`
- [ ] Add `config.yml` service and default entries
