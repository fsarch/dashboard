# Product App

## Purpose
The Product app provides product and catalog management workflows.

## Routes
- Base route: `/product`
- Service route: `/product/[serviceId]`
- Root redirect: `src/app/(with-header)/product/page.tsx`

## Backend and Data Access
- Service layer: `src/services/product/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/product/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

