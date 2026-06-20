---
name: generated-form
description: Assists in creating TGeneratedFormDefinition forms for the dashboard project. Use when creating or updating GeneratedForm-based pages, form definitions, or when working with form-related server components.
version: 1.0
type: skill
license: Proprietary
---

## Overview

`GeneratedForm` is a declarative Server Component that automatically generates forms from a definition. It communicates directly with service APIs via `fetchService`.

### Key Features
- **Server-only**: Must only be used in Server Components (with `'use server-only'` directive)
- **Automatic API calls**: Communicates directly with service APIs via `fetchService`
- **Automatic refresh**: Automatically reloads the page (`router.refresh()`) after successful submit
- **Type-safe**: Definitions are validated via TypeScript types

---

## Basic Structure

```typescript
// src/app/(with-header)/<service>/[serviceId]/<entity>/_forms/<entity>-<action>.form.ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const ENTITY_ACTION_FORM: TGeneratedFormDefinition = {
  inputs: [],           // Form input fields
  initialValues: {},   // Initial form values
  endpoint: {},        // API endpoint for form submission
  dataSources: {},     // Data sources for select inputs (optional)
  postEndpointActions: [], // Actions to execute after submit (optional)
};
```

---

## Input Types

| Type | Description | Example |
|-----|-------------|---------|
| `text` | Text input field | `{ id: 'name', $type: 'text', label: 'Name' }` |
| `textarea` | Multiline text field | `{ id: 'desc', $type: 'textarea', label: 'Description' }` |
| `number` | Numeric input | `{ id: 'count', $type: 'number', label: 'Count' }` |
| `password` | Password field (masked) | `{ id: 'pwd', $type: 'password', label: 'Password' }` |
| `color` | Color picker | `{ id: 'color', $type: 'color', label: 'Color' }` |
| `time` | Time input | `{ id: 'time', $type: 'time', label: 'Time' }` |
| `checkbox` | Checkbox | `{ id: 'active', $type: 'checkbox', label: 'Active' }` |
| `select` | Dropdown selection | See [Select Inputs](#select-inputs) |
| `nested-form` | Nested forms/arrays | See [Nested Forms](#nested-forms) |

---

## Select Inputs

### With DataSource (API query)

```typescript
{
  id: 'categoryId',
  $type: 'select',
  label: 'Category',
  data: {
    $type: 'datasource',
    value: 'categories'  // Reference to dataSources.categories
  },
  enableSearch: true
}
```

### With Constants (static values)

```typescript
{
  id: 'status',
  $type: 'select',
  label: 'Status',
  data: {
    $type: 'constant',
    value: [
      { id: 'active', value: 'active', label: 'Active' },
      { id: 'inactive', value: 'inactive', label: 'Inactive' }
    ]
  }
}
```

**Important:** `value` in select options **MUST be a string**. For numeric IDs, use `value: id + ""`

---

## Nested Forms (Arrays/Objects)

```typescript
{
  id: 'tags',
  $type: 'nested-form',
  label: 'Tags',
  isArray: true,
  addInitialValues: { name: '', color: '#000000' },
  inputs: [
    { id: 'name', $type: 'text', label: 'Name' },
    { id: 'color', $type: 'color', label: 'Color' }
  ]
}
```

---

## DataSources

```typescript
dataSources: {
  categories: {
    $type: 'fetch',
    path: '/v1/categories',
    method: 'GET',
    transformResponse: {
      $type: 'jsonata',
      value: '{ "body": data.{ "id": id, "value": id + "", "label": name } }'
    }
  }
}
```

**Critical:** `transformResponse` MUST return object with `{ body: ... }`!

---

## Endpoint

```typescript
endpoint: {
  path: '/v1/entities',
  method: 'POST',
  body: {
    $type: 'jsonata',
    value: '{ "name": form.name, "description": form.description }'
  }
}
```

---

## Post-Submit Actions

```typescript
postEndpointActions: [
  {
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: '`/my-service/${entityId}/edit`'
    }
  }
]
```

Note: `router.refresh()` is called by default.

---

## JSONata Crash Course

| Syntax | Description | Example |
|--------|-------------|---------|
| `$` | Current element | `data.$` |
| `.field` | Field access | `data.name` |
| `~>` | Deep descent | `data ~> | $ | name |` |
| `{...}` | Object literal | `{ "id": id, "name": name }` |
| `+` | String concat | `name + " (" + id + ")"` |

---

## Complete Example

```typescript
// src/app/(with-header)/watchtower/[serviceId]/aggregation-mode/_forms/aggregation-mode-create.form.ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const AGGREGATION_MODE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Name' },
    {
      id: 'aggregationModeTypeId',
      $type: 'select',
      label: 'Aggregation Mode Type',
      data: { $type: 'datasource', value: 'aggregationModeTypes' },
      enableSearch: true,
    },
    { id: 'maxFactor', $type: 'text', label: 'Max Factor' },
    { id: 'externalId', $type: 'text', label: 'External ID' },
  ],
  dataSources: {
    aggregationModeTypes: {
      $type: 'fetch',
      path: '/v1/aggregation-mode-types?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": data.data.{ "id": id, "value": id + "", "label": name } }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "aggregationModeTypeId": "", "maxFactor": null, "externalId": null }',
  },
  endpoint: {
    path: '/v1/aggregation-modes',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "aggregationModeTypeId": form.aggregationModeTypeId, "maxFactor": form.maxFactor, "externalId": form.externalId }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: '`/watchtower/${serviceId}/aggregation-mode`',
      },
    },
  ],
};
```

---

## Best Practices

1. Always wrap `transformResponse` in `{ "body": ... }`
2. Select `value` must be string (use `id + ""` for numeric IDs)
3. Use relative paths (e.g., `/v1/entities`)
4. Service context is set automatically - no manual `serviceId` needed
5. Store forms in `_forms/` directory
6. Name: `{ENTITY}_{ACTION}_FORM` (e.g., `AGGREGATION_MODE_CREATE_FORM`)
7. Test JSONata expressions at https://try.jsonata.org

---

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot read properties of undefined (reading 'body')` | `transformResponse` missing `{ body: ... }` | Wrap in `{ "body": ... }` |
| Select shows no options | `value` is number | Use `value: id + ""` |
| 404 Error | Wrong path in endpoint | Verify API path |
| 400 Bad Request | Body structure mismatch | Check API documentation |

---

## File Naming Convention

```
src/app/(with-header)/<service>/[serviceId]/<entity>/
├── _forms/
│   ├── <entity>-create.form.ts
│   ├── <entity>-update.form.ts
│   └── ...
└── page.tsx
```

---

## Useful Links

- [GeneratedForm Type Definition](src/components/universals/forms/generated/GeneratedForm.type.ts)
- [GeneratedForm Component](src/components/universals/forms/generated/GeneratedForm.component.tsx)
- [JSONata Online Tester](https://try.jsonata.org)
