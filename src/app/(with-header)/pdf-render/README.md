# PDF Render App

## Purpose
The PDF Render app handles PDF generation and render workflows.

## Routes
- Base route: `/pdf-render`
- Service route: `/pdf-render/[serviceId]`
- Root redirect: `src/app/(with-header)/pdf-render/page.tsx`

## Backend and Data Access
- This app currently has no dedicated service folder in `src/services/`.
- Backend access should still use `fetchService` from `src/utils/fetchService.ts` in server code.

## UI Structure
- App-specific reusable components: `src/components/apps/pdf-render/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

