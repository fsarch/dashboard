# Image App

## Purpose
The Image app handles image-focused management workflows.

## Routes
- Base route: `/image`
- Service route: `/image/[serviceId]`
- Root redirect: `src/app/(with-header)/image/page.tsx`

## Backend and Data Access
- Service layer: `src/services/image/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/image/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

