# Datatable App

## Purpose
The Datatable app provides table-oriented data workflows.

## Routes
- Base route: `/datatable`
- Service route: `/datatable/[serviceId]`
- Root redirect: `src/app/(with-header)/datatable/page.tsx`

## Backend and Data Access
- Service layer: `src/services/datatable/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/datatable/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

