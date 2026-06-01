# Material Tracing App

## Purpose
The Material Tracing app supports tracing and action workflows around material events.

## Routes
- Base route: `/material-tracing`
- Service route: `/material-tracing/[serviceId]`
- Root redirect: `src/app/(with-header)/material-tracing/page.tsx`

## Backend and Data Access
- Service layer: `src/services/material-tracing/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/material-tracing/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

