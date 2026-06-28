---
name: auto-navigation
description: Comprehensive guide for implementing, updating, and managing auto-navigation entries in the dashboard project. Use when adding or modifying sidebar navigation for services, creating route-specific navigation, or troubleshooting navigation issues.
version: 1.0
type: skill
license: Proprietary
---

## Overview

The dashboard uses an automatic navigation system that generates sidebar navigation based on service configuration in `src/constants/apps.ts`.

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `APPS` constant | `src/constants/apps.ts` | Central service configuration |
| `AutoNavigation` | `src/components/universals/page/AutoNavigation.component.tsx` | Renders navigation UI |
| `DefaultPage` | `src/components/universals/page/DefaultPage.component.tsx` | Loads and displays navigation |
| `navigationUtils` | `src/utils/app/navigation.utils.ts` | Processes navigation items |

---

## Quick Start

### Add navigation to a service:

1. Edit `src/constants/apps.ts`
2. Add navigation items to your service configuration
3. Use `DefaultPage` component in your pages

### Example:

```typescript
// src/constants/apps.ts
[EServiceType.WATCHTOWER]: {
  name: 'Watchtower',
  basePath: '/watchtower',
  navigation: [
    { name: 'Übersicht', path: '/', icon: 'layer-group' },
    { name: 'Aggregation Modes', path: '/aggregation-mode', icon: 'cogs' }
  ]
}
```

---

## Configuration Reference

### Navigation Item Structure

```typescript
{
  name: string;              // Display text (use German)
  path: string | { $type: 'jsonata', value: string };  // URL path
  icon: string;              // Icon name
}
```

### Service Configuration

```typescript
{
  name: string;              // Service display name
  basePath: string;          // Base URL path (e.g., '/watchtower')
  navigation?: Array<NavigationItem>;    // Main sidebar items
  bottomNavigation?: Array<NavigationItem>; // Bottom sidebar items (legacy)
  navigations?: Array<{       // Explicit navigation groups (recommended)
    id: string;
    position: 'sidebar' | 'sidebar-bottom';
    items: Array<NavigationItem>;
  }>;
  routes?: {                // Route-specific navigation
    [routePattern: string]: {
      navigation?: Array<NavigationItem>;  // Legacy simple format
      navigations?: Array<{      // Recommended format with positions
        id: string;
        position: 'sidebar' | 'sidebar-bottom';
        items: Array<NavigationItem>;
      }>;
    }
  };
}
```

---

## Common Tasks

### Add a new navigation item

```typescript
// In src/constants/apps.ts
navigation: [
  // existing items...
  { name: 'New Feature', path: '/new-feature', icon: 'sparkles' }
]
```

### Add route-specific navigation

```typescript
routes: {
  '/catalog/:catalogId{/*path}': {
    navigation: [
      { name: 'Back', path: '/catalog', icon: 'arrow-left' },
      {
        name: 'Catalog',
        path: { $type: 'jsonata', value: "'/catalog/' & params.catalogId" },
        icon: 'book'
      }
    ]
  }
}
```

### Remove a navigation item

Simply delete it from the array.

### Reorder navigation items

Change the order in the array - the order determines display order.

### Add sidebar-bottom navigation for specific routes

To show archive/trash buttons only on specific sub-routes (like material-tracing):

```typescript
routes: {
  '/part': {
    navigations: [{
      id: 'bottom',
      position: 'sidebar-bottom',
      items: [{
        name: 'Archiv',
        path: '/part/archive',
        icon: 'archive',
      }],
    }],
  },
}
```

This pattern is used by material-tracing for archive functionality.

---

## Route Patterns

Uses `path-to-regexp` syntax:

- `:param` - Named parameter (e.g., `:catalogId`)
- `{/*path}` - Wildcard for remaining path
- Example: `/catalog/:catalogId{/*path}` matches `/catalog/123` and `/catalog/123/item/456`

---

## Available Icons

### Common Icon Categories

| Category | Icons |
|----------|-------|
| General | `layer-group`, `cog`, `cogs`, `server`, `database`, `puzzle-piece` |
| Lists & Tables | `list`, `table`, `th-list`, `th` |
| Forms | `wpforms`, `edit`, `pencil`, `plus`, `minus` |
| Actions | `trash`, `archive` |
| Navigation | `arrow-left`, `arrow-right`, `chevron-left`, `chevron-right` |
| Content | `file`, `file-lines`, `book`, `copy`, `paste` |
| Data | `hashtag`, `tag`, `tags`, `barcode`, `qrcode` |
| Network | `globe`, `server`, `route`, `link` |
| Security | `shield`, `shield-halved`, `lock`, `key` |
| Time | `clock`, `calendar`, `hourglass` |
| Status | `check`, `xmark`, `exclamation`, `info` |

**Tip:** Search `src/constants/apps.ts` for existing icon names.

---

## Examples

### Simple Service Navigation

```typescript
[EServiceType.SERVICE]: {
  name: 'Service',
  basePath: '/service',
  navigation: [
    { name: 'Dashboard', path: '/', icon: 'layer-group' },
    { name: 'Items', path: '/item', icon: 'list' },
    { name: 'Settings', path: '/settings', icon: 'gear' }
  ]
}
```

### Hierarchical Navigation (Product Service)

```typescript
[EServiceType.PRODUCT]: {
  name: 'Product',
  basePath: '/product',
  navigation: [
    { name: 'Kataloge', path: '/catalog', icon: 'book' }
  ],
  routes: {
    '/catalog/:catalogId{/*path}': {
      navigation: [
        { name: 'Zurück', path: '/catalog', icon: 'arrow-left' },
        {
          name: 'Katalog',
          path: { $type: 'jsonata', value: "'/catalog/' & params.catalogId" },
          icon: 'book'
        },
        {
          name: 'Items',
          path: { $type: 'jsonata', value: "'/catalog/' & params.catalogId & '/item'" },
          icon: 'box'
        },
        {
          name: 'Item-Typen',
          path: { $type: 'jsonata', value: "'/catalog/' & params.catalogId & '/item-type'" },
          icon: 'puzzle-piece'
        }
      ]
    }
  }
}
```

### With Bottom Navigation

```typescript
[EServiceType.SERVICE]: {
  name: 'Service',
  basePath: '/service',
  navigation: [
    { name: 'Dashboard', path: '/', icon: 'layer-group' }
  ],
  bottomNavigation: [
    { name: 'Settings', path: '/settings', icon: 'gear' },
    { name: 'Logs', path: '/logs', icon: 'file-lines' }
  ]
}
```

### With Explicit Navigation Groups (Recommended)

Use `navigations` array with explicit `id` and `position` for more control:

```typescript
[EServiceType.SERVICE]: {
  name: 'Service',
  basePath: '/service',
  navigations: [{
    id: 'main',
    position: 'sidebar',
    items: [
      { name: 'Dashboard', path: '/', icon: 'layer-group' },
      { name: 'Items', path: '/item', icon: 'list' }
    ]
  }, {
    id: 'bottom',
    position: 'sidebar-bottom',
    items: [
      { name: 'Archive', path: '/archive', icon: 'archive' },
      { name: 'Trash', path: '/trash', icon: 'trash' }
    ]
  }]
}
```

### With Route-Specific Navigation Groups

Most flexible approach - different navigation for different routes:

```typescript
[EServiceType.SERVICE]: {
  name: 'Service',
  basePath: '/service',
  navigations: [{
    id: 'main',
    position: 'sidebar',
    items: [
      { name: 'Dashboard', path: '/', icon: 'layer-group' }
    ]
  }],
  routes: {
    '/item': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [
          { name: 'Archive', path: '/item/archive', icon: 'archive' }
        ]
      }]
    }
  }
}
```

### Real-World Example: Metrics with Trash

Based on the material-tracing archive pattern, here's a complete metrics configuration:

```typescript
[EServiceType.METRIC]: {
  name: 'Metrics',
  basePath: '/metric',
  navigation: [{
    name: 'Übersicht',
    path: '/',
    icon: 'layer-group',
  }, {
    name: 'Metric Types',
    path: '/metric-type',
    icon: 'tag',
  }, {
    name: 'Metrics',
    path: '/metric',
    icon: 'chart-line',
  }],
  routes: {
    '/metric': {
      navigations: [{
        id: 'bottom',
        position: 'sidebar-bottom',
        items: [{
          name: 'Papierkorb',
          path: '/metric/trash',
          icon: 'trash',
        }],
      }],
    },
  },
}
```

---

## JSONata for Dynamic Paths

### Basics

| Operator | Description | Example |
|----------|-------------|---------|
| `&` | String concatenation | `'/path/' & params.id` |
| `.` | Property access | `params.catalogId` |

### Examples

```typescript
// Simple parameter
value: "'/catalog/' & params.catalogId"

// Multiple parameters
value: "'/catalog/' & params.catalogId & '/item/' & params.itemId"

// With text
value: "'/user/' & params.userId & '/profile'"
```

---

## Best Practices

1. **Naming**: Use German names for consistency with existing app
2. **Clarity**: Keep names short and descriptive
3. **Paths**: Use relative paths (without basePath)
4. **Order**: Place frequently used items at the top
5. **Grouping**: Group related items together
6. **Icons**: Choose visually representative icons
7. **Dynamic vs Static**: Use static paths for top-level, dynamic (JSONata) for context-specific

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Navigation not showing | Ensure page uses `DefaultPage` component |
| Wrong navigation displayed | Check service `basePath` matches URL |
| Dynamic paths not working | Test JSONata expression at https://try.jsonata.org |
| Icons not displaying | Verify icon name spelling |

---

## Files

| Purpose | Location |
|---------|----------|
| Main configuration | `src/constants/apps.ts` |
| Type definitions | `src/constants/app.type.ts` |
| AutoNavigation component | `src/components/universals/page/AutoNavigation.component.tsx` |
| Navigation utilities | `src/utils/app/navigation.utils.ts` |
| Navigation types | `src/components/universals/page/AutoNavigation.type.ts` |
| Service type enum | `src/utils/configuration.type.ts` |

---

## Validation

Check your skill with:
```bash
# Find all navigation configurations
grep -r "navigation:" src/constants/apps.ts

# Find all route configurations
grep -r "routes:" src/constants/apps.ts
```

---

## See Also

- [App Type Definition](src/constants/app.type.ts)
- [GeneratedForm Skill](../generated-form/SKILL.md)
- [Dashboard Architecture Documentation](../../README.md)
