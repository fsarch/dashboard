# GeneratedForm

`GeneratedForm` is the primary form system for create/update/delete flows.  
It is server-only and renders forms from a definition object, without writing custom JSX form logic.

---

## When to Use

| Situation | Recommendation |
|---|---|
| Standard create/update/delete with known fields | Use `GeneratedForm` |
| Complex client interactions (advanced UX/state) | Formik + Server Action |
| Highly dynamic conditional form behavior | Formik + Server Action |

---

## Base Structure

```ts
import { TGeneratedFormDefinition } from '@/components/universals/forms/generated/GeneratedForm.type';

const MY_FORM: TGeneratedFormDefinition = {
  inputs: [/* fields */],
  initialValues: {/* defaults */},
  endpoint: {/* backend call */},
  postEndpointActions: [/* after-submit actions */],
  dataSources: {/* optional dynamic sources */},
  buttons: { submitButtonText: 'Create' },
};
```

---

## Input Types

### Text

```ts
{ id: 'name', $type: 'text', label: 'Name' }
```

### Textarea

```ts
{ id: 'description', $type: 'textarea', label: 'Description' }
```

### Number

```ts
{ id: 'port', $type: 'number', label: 'Port' }
```

### Checkbox

```ts
{ id: 'enabled', $type: 'checkbox', label: 'Enabled' }
```

Set `variant: 'toggle'` to render it as a toggle/switch instead of a native checkbox. Behavior (Formik field, boolean value, `isEnabled`) stays identical, only the visual presentation changes:

```ts
{ id: 'enabled', $type: 'checkbox', label: 'Enabled', variant: 'toggle' }
```

### Password

```ts
{ id: 'secret', $type: 'password', label: 'Password' }
```

### Color

```ts
{ id: 'color', $type: 'color', label: 'Color' }
```

### Select (constant values)

```ts
{
  id: 'type',
  $type: 'select',
  label: 'Type',
  data: {
    $type: 'constant',
    value: [
      { id: 'option-a', value: 'a', label: 'Option A' },
      { id: 'option-b', value: 'b', label: 'Option B' },
    ],
  },
}
```

### Select (datasource)

```ts
{
  id: 'categoryId',
  $type: 'select',
  label: 'Category',
  enableSearch: true,
  data: {
    $type: 'datasource',
    value: 'categories',
  },
}
```

Important:
- Datasources must resolve to an array of `{ id, value, label }`.
- If not, `SearchableSelect` can fail with `values.find is not a function`.

### Nested Form (object)

```ts
{
  id: 'address',
  $type: 'nested-form',
  label: 'Address',
  inputs: [
    { id: 'street', $type: 'text', label: 'Street' },
    { id: 'city', $type: 'text', label: 'City' },
  ],
}
```

### Nested Form (array)

```ts
{
  id: 'tags',
  $type: 'nested-form',
  label: 'Tags',
  isArray: true,
  addInitialValues: { value: '' },
  inputs: [{ id: 'value', $type: 'text', label: 'Tag' }],
}
```

---

## `initialValues`

### Static object

```ts
initialValues: {
  name: '',
  port: 80,
  enabled: false,
}
```

### JSONata expression

```ts
initialValues: {
  $type: 'jsonata',
  value: '{ "categoryId": dataSource.categories[0].value }',
}
```

Safer with empty guard:

```ts
initialValues: {
  $type: 'jsonata',
  value: `{
    "name": "",
    "categoryId": dataSource.categories[0] ? dataSource.categories[0].value : ""
  }`,
}
```

---

## `endpoint`

```ts
endpoint: {
  path: '/v1/items',
  method: 'POST',
  body: { $type: 'jsonata', value: 'form' },
  headers: { 'X-Custom': 'value' },
}
```

Notes:
- `path` can also be JSONata (dynamic).
- `form` in JSONata is the complete form payload.

Example transformation:

```ts
body: {
  $type: 'jsonata',
  value: '{ "name": form.name, "count": $number(form.count) }',
}
```

---

## `postEndpointActions`

Typical redirect after submit:

```ts
postEndpointActions: [{
  $type: 'redirect',
  url: {
    $type: 'jsonata',
    value: "service.localPath & '/item/' & response.body.id",
  },
}]
```

JSONata context includes:

| Variable | Meaning |
|---|---|
| `response.body` | JSON body returned by endpoint |
| `service.localPath` | current service root path |
| `args.*` | values passed via `<GeneratedForm args={...} />` |

---

## `dataSources`

Datasources are fetched server-side before render:

```ts
dataSources: {
  categories: {
    $type: 'fetch',
    path: '/v1/categories',
    method: 'GET',
    transformResponse: {
      $type: 'jsonata',
      value: '{ "body": [body.{ "id": id, "value": id, "label": name }] }',
    },
  },
}
```

Critical rule:
- `transformResponse` must return `{ "body": [...] }`.
- Keep the array wrapper `[...]`, even for one element.

---

## Use in a Page

```tsx
import GeneratedForm from '@/components/universals/forms/generated/GeneratedForm.component';
import { MY_APP_CREATE_FORM } from '@/services/my-app/my-app.forms';

export default async function CreateItemPage() {
  return (
    <DefaultPage>
      <Section name="Create Item">
        <GeneratedForm definition={MY_APP_CREATE_FORM} />
      </Section>
    </DefaultPage>
  );
}
```

With params/args:

```tsx
export default async function CreateItemPage({ params }) {
  const { parentId } = await params;

  return (
    <DefaultPage>
      <Section name="Create Item">
        <GeneratedForm definition={MY_FORM_FACTORY(parentId)} args={{ parentId }} />
      </Section>
    </DefaultPage>
  );
}
```

---

## Key Files

| File | Purpose |
|---|---|
| `src/components/universals/forms/generated/GeneratedForm.component.tsx` | server entry point |
| `src/components/universals/forms/generated/GeneratedForm.type.ts` | form definition types |
| `src/components/universals/forms/generated/GeneratedForm.utils.ts` | datasource resolution + submit execution |
| `src/components/universals/forms/generated/GeneratedClientForm.component.tsx` | client/formik renderer |
| `src/services/email/email.forms.ts` | rich nested-form example |
| `src/services/material-tracing/material.forms.ts` | datasource + upload example |
| `src/services/frontier/frontier.forms.ts` | dynamic selects example |
