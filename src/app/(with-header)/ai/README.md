# AI App

## Purpose
The AI app provides conversational features and AI-assisted workflows.

## Routes
- Base route: `/ai`
- Service route: `/ai/[serviceId]`
- Root redirect: `src/app/(with-header)/ai/page.tsx`

## Backend and Data Access
- Service layer: `src/services/ai/`
- In server code, use `fetchService` from `src/utils/fetchService.ts`.

## UI Structure
- App-specific reusable components: `src/components/apps/ai/`
- Prefer universal UI elements from `src/components/universals/`.

## Form and Dialog Conventions
- Prefer `GeneratedForm` for create/update/delete flows when possible.
- Use Formik + server action + service layer when `GeneratedForm` is not a fit.
- Use `useOpenDialog` with `AlertDialog` for alerts and confirmations.

