# Printer App

## Purpose
The Printer app manages printer server workflows.

## Routes
- Base route: `/printer`
- Service route: `/printer/[serviceId]`
- Root redirect: `src/app/(with-header)/printer/page.tsx`

## Backend and Data Access
- Service layer: `src/services/printer/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/printer/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

