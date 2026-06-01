# Email App

## Purpose
The Email app manages mail server related features.

## Routes
- Base route: `/email`
- Service route: `/email/[serviceId]`
- Root redirect: `src/app/(with-header)/email/page.tsx`

## Backend and Data Access
- Service layer: `src/services/email/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/email/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

