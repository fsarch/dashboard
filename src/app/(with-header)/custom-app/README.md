# Custom App

## Purpose
The Custom App renders data-driven applications configured through YAML files in `addons/`.

## Routes
- Base route: `/custom-app`
- Service route: `/custom-app/[serviceId]`
- Route root folder: `src/app/(with-header)/custom-app/`

## Backend and Data Access
- Custom app runtime logic: `src/components/apps/custom-app/custom-app.utils.ts`
- Configuration schema: `schemas/custom-app-schema.json`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific components and rendering logic: `src/components/apps/custom-app/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

