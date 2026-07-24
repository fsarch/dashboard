# Image App Documentation

> **Documentation language rule:** All files in `docs/` must be written in English.

This document describes the Image application integration within the fsarch/dashboard project, including the Visibility and Tags features added in July 2026.

---

## Overview

The Image app provides functionality for managing images through the dashboard, including:
- Image listing with pagination and filtering
- Image detail views
- Visibility management (public/private)
- Tag system with tag definitions and image tags

---

## Routing Structure

| Route | Component | Purpose |
|-------|-----------|---------|
| `/image/{serviceId}` | `ImageListPage` | Lists all images with pagination, filtering, and visibility/tags display |
| `/image/{serviceId}/images/{imageId}` | `ImageDetailPage` | Shows image details and allows tag management |
| `/image/{serviceId}/tags` | `TagDefinitionsPage` | Manages tag definitions for the service instance |

---

## API Endpoints

The Image app communicates with the Image Server API at `http://localhost:3001/docs-yaml`.

### Images

#### GET `/v1/admin/images`
- **Returns**: `PaginationResultDto<ImageDto>`
- **Query Parameters**:
  - `embed`: array<string> - Embed related data (e.g., `embed=tags` to include tags)
  - `isPublic`: boolean - Filter by visibility
  - `tag`: array<string> - Filter by tag strings
  - `page`: number - Page number (1-based)
  - `limit`: number - Items per page

#### GET `/v1/admin/images/{imageId}`
- **Returns**: `ImageDto`
- **Query Parameters**:
  - `embed`: array<string> - Embed related data

#### GET `/v1/admin/images/{imageId}/raw`
- **Returns**: Raw image data (ArrayBuffer)
- **Query Parameters**:
  - `size`: number - Image size

#### DELETE `/v1/admin/images/{imageId}`
- Deletes an image

### Tag Definitions

#### GET `/v1/admin/images/tags/definitions`
- **Returns**: `TagDefinitionDto[]` - List of all tag definitions

#### POST `/v1/admin/images/tags/definitions`
- **Body**: `{ key: string, description?: string }`
- **Returns**: `TagDefinitionDto` - The created tag definition

#### DELETE `/v1/admin/images/tags/definitions/{tagDefinitionId}`
- Deletes a tag definition

### Image Tags

#### GET `/v1/admin/images/{imageId}/tags`
- **Returns**: `string[]` - Array of tag strings assigned to the image

#### POST `/v1/admin/images/{imageId}/tags`
- **Body**: `{ key: string, value: string }`
- **Returns**: `string` - The created tag
- **Note**: The API generates a tag string from key and value (format: `"key:value"`)

#### DELETE `/v1/admin/images/{imageId}/tags/{tagValue}`
- Deletes a tag from an image
- **Note**: `tagValue` is the string value of the tag (URL-encoded)

---

## Type Definitions

### `TagDefinitionDto`
```typescript
export type TagDefinitionDto = {
  id: string;
  key: string;
  description?: string;
  creationTime: string;
};
```

### `ImageDto`
```typescript
export type ImageDto = {
  id: string;
  fileSize: number;
  width: number;
  height: number;
  mimeType: string;
  md5: string;
  hasAlpha: boolean;
  hasAnimation: boolean;
  creationTime: string;
  deletionTime?: string;
  isPublic: boolean;        // Visibility flag (added July 2026)
  externalId?: string;     // External reference ID (added July 2026)
  tags?: string[];         // Image tags as simple strings (added July 2026)
  slugs?: Array<{ slug: string }>;
};
```

### `PaginationResultMetaDto`
```typescript
export type PaginationResultMetaDto = {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
```

### `PaginationResultDto<T>`
```typescript
export type PaginationResultDto<T> = {
  data: T[];
  metadata: PaginationResultMetaDto;
};
```

### `ListImagesOptions`
```typescript
export type ListImagesOptions = {
  embed?: string[];
  isPublic?: boolean;
  tag?: string[];
  page?: number;
  limit?: number;
};
```

---

## Services

The Image app uses the `imagesAdminService` defined in `src/services/image/images-admin.service.ts`.

### Available Methods

#### Image Operations
- `listImages(options?: ListImagesOptions)`: Returns paginated list of images
- `getRawById(imageId, options?)`: Returns raw image data
- `uploadImage(options)`: Uploads a new image
- `uploadImageByUrl(options)`: Uploads an image to a custom image server URL
- `getImageById(imageId)`: Returns a single image with embedded tags

#### Tag Definition Operations
- `listTagDefinitions()`: Returns all tag definitions
- `createTagDefinition(data)`: Creates a new tag definition
- `deleteTagDefinition(tagDefinitionId)`: Deletes a tag definition

#### Image Tag Operations
- `listImageTags(imageId)`: Returns all tags for an image
- `addImageTag(imageId, data)`: Adds a tag to an image
- `deleteImageTag(imageId, tagValue)`: Deletes a tag from an image

### Usage Example

```typescript
import { imagesAdminService } from '@/services/image/images-admin.service';

// List images with tags and pagination
const result = await imagesAdminService.listImages({
  embed: ['tags'],
  page: 1,
  limit: 25,
  isPublic: true,
  tag: ['category:product'],
});

const images = result.data;  // ImageDto[]
const metadata = result.metadata;  // PaginationResultMetaDto
```

---

## Form Definitions

The Image app uses GeneratedForm for CRUD operations. Form definitions are in `src/services/image/image.forms.ts`.

### `IMAGE_TAG_DEFINITION_CREATE_FORM`
- Creates a new tag definition
- Fields: `key` (required), `description` (optional)
- Submits to: `POST /v1/admin/images/tags/definitions`
- Redirects to: `/tags` after creation

### `IMAGE_TAG_CREATE_FORM(imageId)`
- Adds a new tag to an image
- Fields: `key` (select from tag definitions), `value` (required)
- Data source: Fetches tag definitions from `/v1/admin/images/tags/definitions`
- Submits to: `POST /v1/admin/images/{imageId}/tags`
- Redirects to: `/images/{imageId}` after creation

---

## UI Components

### Image List Page (`[serviceId]/page.tsx`)

**Features:**
- Pagination with page navigation
- Filter by visibility (All/Public/Private)
- Displays images with:
  - Thumbnail preview
  - ID, dimensions, MIME type, file size, MD5
  - Visibility badge (green for public, red for private)
  - Alpha/Animation badges
  - Tags displayed as badges
  - Slugs list
- Click on image navigates to detail page
- Image upload form

**Screenshot Structure:**
```
[Filter Dropdown] [Filter Button]

[Image Card 1]     [Image Card 2]
┌─────────────────┐ ┌─────────────────┐
│ ✓ Transparenz   │ │ ✓ Animation      │
│ ✓ Öffentlich    │ │ ✗ Privat         │
│ 🏷️ tag1         │ │ 🏷️ tag1, tag2   │
│                 │ │                 │
│ [Image Preview] │ │ [Image Preview] │
│                 │ │                 │
│ Breite: 800px   │ │ Breite: 1024px  │
│ Höhe: 600px     │ │ Höhe: 768px     │
│ ...            │ │ ...            │
└─────────────────┘ └─────────────────┘

[Pagination Controls]
← Zurück | Seite 1 von 5 | Weiter →

[Image Upload Form]
```

### Image Detail Page (`[serviceId]/images/{imageId}/page.tsx`)

**Features:**
- Back link to image list
- Image information section:
  - Full-size preview (300x300px)
  - All metadata (ID, dimensions, MIME type, file size, MD5, visibility, alpha, animation, slugs, external ID)
- Tags section:
  - List of current tags with delete buttons
  - "No tags" message if empty
- Add new tag form:
  - Select tag definition from dropdown
  - Enter tag value
  - Submit button

### Tag Definitions Page (`[serviceId]/tags/page.tsx`)

**Features:**
- Back link to image list
- Table of tag definitions:
  - Key (monospace)
  - Description
  - Creation date
  - Delete button for each definition
- "No tag definitions" message if empty
- Create new tag definition form:
  - Key field (required)
  - Description field (optional)
  - Submit button

---

## Navigation

The Image app navigation is defined in `src/constants/apps.ts`:

```typescript
[EServiceType.IMAGE]: {
  name: 'Image',
  basePath: '/image',
  navigation: [
    { name: 'Übersicht', path: '/', icon: 'layer-group' },
    { name: 'Bilder', path: '/', icon: 'images' },
    { name: 'Tag-Definitionen', path: '/tags', icon: 'tags' },
  ],
}
```

- The "Bilder" (Images) navigation item shows the image list
- The "Tag-Definitionen" (Tag Definitions) navigation item shows the tag definitions management page

---

## Implementation Patterns

### Server Components
All pages in the Image app are Server Components, which means:
- Data fetching happens on the server
- No client-side state management needed for initial render
- Direct database/API access via service layer

### Data Fetching
- Use `fetchService` from `@/utils/fetchService` for API calls
- `fetchService` automatically:
  - Resolves the base URL from service configuration
  - Injects the bearer token for authentication
  - Handles errors appropriately

### Form Handling
- Use `GeneratedForm` component for standard CRUD forms
- Forms are defined as configuration objects (TypeScript)
- Supports JSONata for dynamic values and transformations
- Server actions handle form submissions

### Pagination
- API returns `PaginationResultDto<T>` with `data` and `metadata`
- Metadata includes: `currentPage`, `pageSize`, `totalItems`, `totalPages`
- URL query parameters: `page`, `limit`
- Navigation links preserve other filters

### Embedding Related Data
- Use `embed` query parameter to include related data in the response
- Example: `embed=tags` includes image tags in the list response
- Reduces number of API calls

---

## Styling

Each page has its own SCSS module file following the pattern `page.module.scss`.

### Common Classes
- `.backLink`: Back navigation link with hover underline
- `.imageInfo`: Flex container for image preview and details
- `.imagePreview`: Container for image with border and background
- `.imageDetails`: Grid layout for image metadata
- `.tagsList`: Flex column for tag items
- `.tagItem`: Container for a single tag with delete button
- `.pagination`: Container for pagination controls
- `.paginationInfo`: Shows "Showing X-Y of Z items"
- `.paginationControls`: Container for page navigation buttons

---

## Visibility Feature

### Purpose
The visibility feature allows marking images as public or private.

### Implementation
- `isPublic: boolean` field in `ImageDto`
- Green badge ("Öffentlich") for public images
- Red badge ("Privat") for private images
- Filter option in image list: All/Public/Private
- API filter parameter: `isPublic`

### Default Behavior
- Image list shows **all** images by default (no filter applied)
- Visibility is displayed as a badge on each image
- Can be filtered via dropdown in the list page

---

## Tags Feature

### Purpose
The tags feature allows categorizing and filtering images using custom tags.

### Concepts

#### Tag Definitions
- Global definitions for tag keys
- Each definition has: `id`, `key`, `description`, `creationTime`
- Created via the Tag Definitions page
- Used to provide consistent tag keys across images

#### Image Tags
- Tags assigned to individual images
- Stored as simple strings in `ImageDto.tags: string[]`
- Format: Typically `"key:value"` (e.g., `"category:product"`, `"color:red"`)
- Can be added/removed via the Image Detail page

### Implementation Details

#### Tag Storage
- **Important**: Image tags are stored as `string[]`, not as complex objects
- The API endpoint `POST /v1/admin/images/{id}/tags` accepts `{ key, value }` and generates a string
- The format of the generated string depends on the API implementation

#### Tag Display
- Tags are displayed as badges (purple color) on both:
  - Image list (under the image headline)
  - Image detail page (in the Tags section)

#### Tag Filtering
- Image list can be filtered by tags using the `tag` query parameter
- Accepts array of tag strings
- Example: `?tag=category:product,color:red`

### Tag Definition Scope
- Tag definitions are **per service instance**
- Each image service can have its own set of tag definitions
- Tag definitions are managed on the `/tags` page

---

## Configuration

The Image app uses the standard dashboard configuration system:
- Service configuration in `config.yml`
- Service type: `image`
- Each service instance can have its own:
  - `id`: Service identifier
  - `url`: Base URL of the image server
  - Other service-specific configuration

---

## Testing

To test the Image app functionality:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the image list:**
   - Open `http://localhost:3000/image/{serviceId}` in your browser

3. **Test features:**
   - Verify images are listed with pagination
   - Check visibility badges are displayed
   - Verify tags are shown on images
   - Test filtering by visibility
   - Click on an image to view details
   - Add/remove tags on an image
   - Navigate to Tag Definitions page
   - Create/delete tag definitions

---

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check the service configuration in `config.yml`
   - Verify the image server is running and accessible
   - Check the browser console for network errors

2. **Tags not appearing**
   - Verify `embed=tags` is included in the API call
   - Check that images have tags assigned
   - Verify the tag format matches what the API returns

3. **Pagination not working**
   - Check that the API returns proper metadata
   - Verify page and limit parameters are being passed correctly
   - Ensure the URL building preserves other query parameters

4. **Form submissions failing**
   - Check the GeneratedForm definition
   - Verify the endpoint path is correct
   - Check the request body format
   - Review server logs for errors

---

## Related Files

| File | Purpose |
|------|---------|
| `src/services/image/images-admin.type.ts` | Type definitions |
| `src/services/image/images-admin.service.ts` | Service layer |
| `src/services/image/image.forms.ts` | Form definitions |
| `src/services/image/images.service.ts` | Public image services |
| `src/app/(with-header)/image/[serviceId]/page.tsx` | Image list page |
| `src/app/(with-header)/image/[serviceId]/page.module.scss` | Image list styles |
| `src/app/(with-header)/image/[serviceId]/images/[imageId]/page.tsx` | Image detail page |
| `src/app/(with-header)/image/[serviceId]/images/[imageId]/page.module.scss` | Image detail styles |
| `src/app/(with-header)/image/[serviceId]/tags/page.tsx` | Tag definitions page |
| `src/app/(with-header)/image/[serviceId]/tags/page.module.scss` | Tag definitions styles |
| `src/constants/apps.ts` | App configuration and navigation |

---

## Version History

| Date | Change | Author |
|------|--------|--------|
| July 2026 | Initial implementation of Visibility and Tags features | Mistral Vibe |
| July 2026 | Added pagination to image list | Mistral Vibe |
| July 2026 | Changed from separate tags page to integrated image detail page | Mistral Vibe |

---

## See Also

- [Dashboard Documentation](README.md)
- [Navigation System](navigation.md)
- [GeneratedForm System](generated-form.md)
- [Service Layer](service-layer.md)
- [Adding a New App](new-app.md)
