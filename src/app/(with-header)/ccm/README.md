# Customer Communication App

## Purpose
The Customer Communication app handles communication-related features.

## Routes
- Base route: `/ccm`
- Service route: `/ccm/[serviceId]`
- Root redirect: `src/app/(with-header)/ccm/page.tsx`

## Backend and Data Access
- Service layer: `src/services/customer-communication/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/customer-communication/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

