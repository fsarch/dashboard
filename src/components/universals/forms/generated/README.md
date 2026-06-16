# GeneratedForm – Declarative Form Component

`GeneratedForm` is a declarative component for **Server Components** that automatically generates forms from a definition. It simplifies the creation of CRUD forms and ensures all forms in the project have a consistent look and feel.

---

## 📋 Core Concept

- **Server-only**: `GeneratedForm` must only be used in **Server Components** (has `'use server-only'` directive).
- **Automatic API calls**: Communicates directly with service APIs via `fetchService`.
- **Automatic refresh**: Automatically reloads the page (`router.refresh()`) after successful submit.
- **Type-safe**: Definitions are validated via TypeScript types.

---

## 🚀 Quick Start

### 1. Create Form Definition

Create a `.form.ts` file with a `TGeneratedFormDefinition`:

```typescript
// src/app/(with-header)/my-service/_forms/my-entity-create.form.ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

export const MY_ENTITY_CREATE_FORM: TGeneratedFormDefinition = {
  inputs: [
    { id: 'name', $type: 'text', label: 'Name' },
    { id: 'description', $type: 'textarea', label: 'Description' },
  ],
  initialValues: {
    $type: 'jsonata',
    value: '{ "name": "", "description": "" }'
  },
  endpoint: {
    path: '/v1/my-entities',
    method: 'POST',
    body: {
      $type: 'jsonata',
      value: '{ "name": form.name, "description": form.description }'
    }
  }
};
```

### 2. Use in a Page

```typescript
// src/app/(with-header)/my-service/page.tsx
import { DefaultPage } from '@/components/universals/page/DefaultPage.component';
import Section from '@/components/universals/section/Section';
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { MY_ENTITY_CREATE_FORM } from './_forms/my-entity-create.form';

export default async function Page() {
  return (
    <DefaultPage>
      <Section name="Create Entity">
        <GeneratedForm definition={MY_ENTITY_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
```

---

## 📖 Definition Reference

### `TGeneratedFormDefinition`

| Field | Type | Required | Description |
|------|-----|----------|--------------|
| `inputs` | `TGeneratedFormInput[]` | ✅ | List of form inputs |
| `initialValues` | `TGeneratedFormInitialValues` | ✅ | Initial form values |
| `endpoint` | `TGeneratedFormEndpoint` | ✅ | API endpoint for form submission |
| `dataSources` | `Record<string, TGeneratedFormDataSource>` | ❌ | Data sources for select inputs etc. |
| `postEndpointActions` | `TGeneratedFormAction[]` | ❌ | Actions to execute after submit (e.g., redirect) |
| `buttons` | `TSubmitButtonsFormDefinition` | ❌ | Customize submit buttons |

---

## 📥 Input Types

| Type | Description | Example |
|-----|--------------|----------|
| `text` | Text input field | `{ id: 'name', $type: 'text', label: 'Name' }` |
| `textarea` | Multiline text field | `{ id: 'desc', $type: 'textarea', label: 'Description' }` |
| `number` | Number input field | `{ id: 'count', $type: 'number', label: 'Count' }` |
| `password` | Password field (masked) | `{ id: 'pwd', $type: 'password', label: 'Password' }` |
| `color` | Color picker | `{ id: 'color', $type: 'color', label: 'Color' }` |
| `time` | Time input | `{ id: 'time', $type: 'time', label: 'Time' }` |
| `checkbox` | Checkbox | `{ id: 'active', $type: 'checkbox', label: 'Active' }` |
| `select` | Dropdown selection | See [Select Inputs](#select-inputs) |
| `nested-form` | Nested forms/arrays | See [Nested Forms](#nested-forms) |
| `image-server-upload` | Image upload | `{ id: 'image', $type: 'image-server-upload', ... }` |
| `link-card` | Link card | `{ id: 'link', $type: 'link-card', ... }` |

---

### Select Inputs

Select fields can get their options from **DataSources** or **constants**.

#### With DataSource (API query)

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

#### With Constants (static values)

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

**⚠️ Important:** `value` in select options **MUST be a string**. Use `id + ""` for numeric IDs.

---

### Nested Forms (Arrays)

For arrays or nested objects:

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

## 🔗 DataSources

DataSources load data from API endpoints and provide it for select inputs.

### Structure

```typescript
dataSources: {
  // Key = reference name (e.g., 'categories')
  categories: {
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
> The `GeneratedForm.utils` expects `responseData.body` to exist.
> Your JSONata expression should wrap the result in `{ "body": ... }`.

```typescript
// ❌ WRONG (returns array directly)
value: 'data.{ "id": id, "value": id, "label": name }'

// ✅ CORRECT (wraps result in { body: ... })
value: '{ "body": data.{ "id": id, "value": id + "", "label": name } }'
```

---

## 🎯 Endpoint

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

## 🔄 Post-Submit Actions

Actions executed after successful submission (e.g., redirect):

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

## 📊 JSONata Crash Course

JSONata is used for dynamic values in `body`, `transformResponse`, and `url`.

### Basics

| Syntax | Description | Example |
|--------|--------------|----------|
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

## ⚠️ Common Errors & Solutions

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

**Causes & Solutions:**

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

## 📚 Examples from the Project

| Entity | File | Features |
|--------|------|----------|
| Function | `function/_forms/create-function.form.ts` | Simple text field |
| Part Type | `material-tracing/part-type.forms.ts` | Text + externalId |
| Domain Group | `frontier/domain-group/_forms/` | Complex nested structures |
| Credence Event | `credence/event/_forms/event-create.form.ts` | Nested array (scopes) + DataSource |
| Aggregation Mode | `credence/aggregation-mode/_forms/` | Select (aggregationModeTypeId) + maxFactor |
| Aggregation Mode Type | `credence/aggregation-mode-type/_forms/` | Simple text fields |

### Aggregation Mode & Aggregation Mode Type

The Credence service supports **Aggregation Modes** and **Aggregation Mode Types** for advanced score calculation:

- **Aggregation Mode Type**: Defines the type of aggregation (e.g., "SUM", "MAX", "AVG")
  - Fields: `name`, `externalId`
  - Endpoints: `GET /v1/aggregation-mode-types`, `POST /v1/aggregation-mode-types`

- **Aggregation Mode**: Configures how events are aggregated for scoring
  - Fields: `name`, `aggregationModeTypeId` (select), `maxFactor`, `externalId`
  - Endpoints: `GET /v1/aggregation-modes`, `POST /v1/aggregation-modes`, `PATCH /v1/aggregation-modes/{id}`

---

## 🔧 Debugging

1. **Validate form definition:**
   ```bash
   # TypeScript checks the definition at compile time
   npm run build
   ```

2. **Test API response:**
   - Manually test in browser/Postman
   - Compare structure with `transformResponse`

3. **Test JSONata expressions:**
   - Online tester: [https://try.jsonata.org](https://try.jsonata.org)
   - Sample data: `{ "data": [{ "id": 1, "name": "Test" }] }`

---

## 📌 Best Practices

1. ✅ **Always wrap `transformResponse` in `{ "body": ... }`**
2. ✅ **Select `value` must be string** (use `id + ""` for numeric IDs)
3. ✅ **Use relative paths** (e.g., `/v1/entities`)
4. ✅ **Service context is set automatically** – No manual `serviceId` needed!
5. ✅ **Store forms in `_forms/` directory** (convention)
6. ✅ **Name: `{ENTITY}_{ACTION}_FORM`** (e.g., `PART_TYPE_CREATE_FORM`)
7. ✅ **Test JSONata expressions** before deployment

---

## 📖 See Also

- [GeneratedForm Type Definition](GeneratedForm.type.ts) – All types and structures
- [GeneratedForm Component](GeneratedForm.component.tsx) – Implementation details
- [GeneratedForm Utils](GeneratedForm.utils.ts) – Helper functions
