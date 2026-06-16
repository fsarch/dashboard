---
name: generated-form
description: A skill that helps with creating TGeneratedFormDefinition forms for the dashboard project.
---

# GeneratedForm Skill

**Purpose:** Assists in creating `TGeneratedFormDefinition` forms for the dashboard project.

## Overview

`GeneratedForm` is a declarative Server Component that automatically generates forms from a definition. It communicates directly with service APIs via `fetchService`.

### Key Features
- **Server-only**: Must only be used in Server Components (with `'use server-only'` directive)
- **Automatic API calls**: Communicates directly with service APIs via `fetchService`
- **Automatic refresh**: Automatically reloads the page (`router.refresh()`) after successful submit
- **Type-safe**: Definitions are validated via TypeScript types

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

Select fields can get their options from **DataSources** or **constants**.

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
  enableSearch: true  // Optional: Enable search functionality
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

**⚠️ Important:** `value` in select options **MUST be a string**. For numeric IDs, use `value: id + ""`

---

## Nested Forms (Arrays/Objects)

```typescript
{
  id: 'tags',
  $type: 'nested-form',
  label: 'Tags',
  isArray: true,           // Treat as array
  addInitialValues: {     // Default values for new entries
    name: '',
    color: '#000000'
  },
  inputs: [
    { id: 'name', $type: 'text', label: 'Name' },
    { id: 'color', $type: 'color', label: 'Color' }
  ]
}
```

---

## DataSources

DataSources load data from API endpoints and provide it for select inputs.

### Structure

```typescript
dataSources: {
  // Key = reference name (e.g., 'categories')
  categories: {
    $type: 'fetch',
    path: '/v1/categories',      // Relative path to service
    method: 'GET',
    transformResponse: {
      $type: 'jsonata',
      // ⚠️ IMPORTANT: transformResponse MUST return an object with { body: ... }!
      value: '{ "body": data.{ "id": id, "value": id + "", "label": name } }'
    }
  }
}
```

### Key Rule for `transformResponse`

> **⚠️ `transformResponse` MUST return an object with a `body` property!**
> 
> The `GeneratedForm.utils` expects `responseData.body`.
> Your JSONata expression should wrap the result in `{ "body": ... }`.

```typescript
// ❌ WRONG (returns array directly)
value: 'data.{ "id": id, "value": id, "label": name }'

// ✅ CORRECT (wraps result in { body: ... })
value: '{ "body": data.{ "id": id, "value": id + "", "label": name } }'
```

---

## Endpoint

Defines where the form data is sent:

```typescript
endpoint: {
  path: '/v1/entities',     // Relative path to service
  method: 'POST',          // HTTP method (POST, PUT, PATCH, DELETE)
  body: {
    $type: 'jsonata',
    value: '{ "name": form.name, "description": form.description }'
  },
  headers: {               // Optional: Additional headers
    'Content-Type': 'application/json'
  }
}
```

---

## Post-Submit Actions

Actions executed after successful submission:

```typescript
postEndpointActions: [
  {
    $type: 'redirect',
    url: {
      $type: 'jsonata',
      value: '`/my-service/${entityId}/edit`'  // JSONata expression
    }
  }
]
```

**Note:** By default, `router.refresh()` is called to reload the page. A redirect is only needed if you want to navigate to a different page.

---

## JSONata Crash Course

JSONata is used for dynamic values in `body`, `transformResponse`, and `url`.

### Basics

| Syntax | Description | Example |
|--------|-------------|---------|
| `$` | Current element | `data.$` |
| `.field` | Field access | `data.name` |
| `~>` | Deep descent (all elements recursively) | `data ~> | $ | name |` |
| `{...}` | Object literal | `{ "id": id, "name": name }` |
| `+` | String concatenation | `name + " (" + id + ")"` |
| Ternary | Conditional logic | `active ? "Active" : "Inactive"` |

### Common Patterns

#### Transform array of objects
```jsonata
data.{ "id": id, "value": id + "", "label": name }
```

#### Filter array
```jsonata
data.[active = true].{ "id": id, "value": id, "label": name }
```

#### Nested objects
```jsonata
data.{
  "id": id,
  "label": name + " (" + category.name + ")"
}
```

#### Process form data
```jsonata
{
  "name": form.name,
  "active": form.active != "" ? form.active : null
}
```

---

## Complete Examples

### Simple Form (AggregationModeType)

```typescript
// src/app/(with-header)/credence/[serviceId]/aggregation-mode-type/_forms/aggregation-mode-type-create.form.ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const AGGREGATION_MODE_TYPE_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Name' },
    { id: 'externalId', $type: 'text', label: 'External ID' },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "externalId": null }',
  },
  endpoint: {
    path: '/v1/aggregation-mode-types',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "externalId": form.externalId }',
    },
  },
  postEndpointActions: [
    {
      $type: 'redirect',
      url: {
        $type: 'jsonata',
        value: '`/credence/${serviceId}/aggregation-mode-type`',
      },
    },
  ],
};
```

### Form with Select (AggregationMode)

```typescript
// src/app/(with-header)/credence/[serviceId]/aggregation-mode/_forms/aggregation-mode-create.form.ts
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
        value: '`/credence/${serviceId}/aggregation-mode`',
      },
    },
  ],
};
```

### Form with Nested Fields (Event Create)

```typescript
// src/app/(with-header)/credence/[serviceId]/event/_forms/event-create.form.ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const EVENT_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    {
      id: 'eventTypeId',
      $type: 'select',
      label: 'Event Type',
      data: { $type: 'datasource', value: 'eventTypes' },
    },
    {
      id: 'scopes',
      $type: 'nested-form',
      label: 'Scopes',
      isArray: true,
      addInitialValues: { type: 'ip', value: '' },
      inputs: [
        {
          id: 'type',
          $type: 'select',
          label: 'Type',
          data: {
            $type: 'constant',
            value: [
              { id: 'ip', value: 'ip', label: 'IP' },
              { id: 'asn', value: 'asn', label: 'ASN' },
              { id: 'subnet', value: 'subnet', label: 'Subnet' },
            ],
          },
        },
        { id: 'value', $type: 'text', label: 'Value' },
      ],
    },
    { id: 'externalId', $type: 'text', label: 'External ID (optional)' },
  ],
  dataSources: {
    eventTypes: {
      $type: 'fetch',
      path: '/v1/event-types?page=1&pageSize=100',
      method: 'GET',
      transformResponse: {
        $type: 'jsonata',
        value: '{ "body": data.{ "id": id, "value": id, "label": name + " (Score: " + defaultScoreFactor + ")" } }',
      },
    },
  },
  initialValues: {
    $type: 'jsonata',
    value: '{ "eventTypeId": "", "scopes": [], "externalId": "" }',
  },
  endpoint: {
    path: '/v1/events',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: `{
        "eventTypeId": form.eventTypeId,
        "scopes": form.scopes ~> | $ | { "type": type, "value": value } |,
        "externalId": form.externalId != "" ? form.externalId : null
      }`,
    },
  },
};
```

---

## Best Practices

1. ✅ **Always wrap `transformResponse` in `{ "body": ... }`**
2. ✅ **Select `value` must be string** (use `id + ""` for numeric IDs)
3. ✅ **Use relative paths** (e.g., `/v1/entities`)
4. ✅ **Service context is set automatically** - No manual `serviceId` needed!
5. ✅ **Store forms in `_forms/` directory** (convention)
6. ✅ **Name: `{ENTITY}_{ACTION}_FORM`** (e.g., `AGGREGATION_MODE_CREATE_FORM`)
7. ✅ **Test JSONata expressions** before deployment (Online tester: https://try.jsonata.org)

---

## Common Errors & Solutions

### 1. `Cannot read properties of undefined (reading 'body')`

**Cause:** `transformResponse` does not return an object with `body` property.

**Solution:**
```typescript
// ❌ WRONG
value: 'data.{ "id": id, "value": id, "label": name }'

// ✅ CORRECT
value: '{ "body": data.{ "id": id, "value": id + "", "label": name } }'
```

### 2. Select Shows No Options

| Symptom | Cause | Solution |
|---------|-------|----------|
| Dropdown is empty | `value` is number, select expects string | Use `"value": id + ""` |
| API call failed | Path is incorrect | Verify path (relative to service!) |
| DataSource not referenced | Wrong key in `data` | Verify key matches dataSources |

### 3. Submit Not Working

| Symptom | Cause | Solution |
|---------|-------|----------|
| 404 Error | Path in `endpoint` is wrong | Verify path |
| 400 Bad Request | `body` structure doesn't match API | Check API documentation |
| No redirect/refresh | No postEndpointActions defined | `router.refresh()` is called by default |

---

## File Naming Convention

```
src/app/(with-header)/<service>/[serviceId]/<entity>/
├── _forms/
│   ├── <entity>-create.form.ts      # Create form
│   ├── <entity>-update.form.ts      # Update form (optional)
│   └── ...
├── _components/
│   ├── <Entity>List.component.tsx  # List component
│   └── ...
├── page.tsx                        # List/create page
├── [id]/
│   ├── page.tsx                    # Detail page
│   └── _components/
│       └── <Entity>Detail.component.tsx
└── create/
    └── page.tsx                    # Create page (optional)
```

---

## Generation Workflow

1. **Identify API endpoint** (e.g., `/v1/aggregation-modes`)
2. **Analyze schema** (which fields, types, required/optional)
3. **Create form definition** in `_forms/` directory
4. **Create page** that uses the form
5. **Verify TypeScript compilation** (`npm run build`)
6. **Test form**

---

## Useful Links

- [GeneratedForm Type Definition](src/components/universals/forms/generated/GeneratedForm.type.ts)
- [GeneratedForm Component](src/components/universals/forms/generated/GeneratedForm.component.tsx)
- [GeneratedForm Utils](src/components/universals/forms/generated/GeneratedForm.utils.ts)
- [JSONata Online Tester](https://try.jsonata.org)
