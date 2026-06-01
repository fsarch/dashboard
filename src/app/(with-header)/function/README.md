# Function App

## Purpose
The Function app provides management and execution workflows for backend functions.

## Routes
- Base route: `/function`
- Service route: `/function/[serviceId]`
- Root redirect: `src/app/(with-header)/function/page.tsx`

## Backend and Data Access
- Service layer: `src/services/function/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- This app currently has no dedicated reusable component folder in `src/components/apps/`.
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

