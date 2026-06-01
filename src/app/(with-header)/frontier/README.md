# Frontier App

## Purpose
The Frontier app handles domain-group based edge and delivery configuration workflows.

## Routes
- Base route: `/frontier`
- Service route: `/frontier/[serviceId]`
- Root redirect: `src/app/(with-header)/frontier/page.tsx`

## Backend and Data Access
- Service layer: `src/services/frontier/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- This app currently has no dedicated reusable component folder in `src/components/apps/`.
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

