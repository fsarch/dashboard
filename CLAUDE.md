# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Read `AGENTS.md` first** — it contains a dense architecture summary (in German) and is kept up to date.
> **Deeper docs live in `docs/`** (English-only, entry point `docs/README.md`): `navigation.md`, `new-app.md`, `generated-form.md`, `service-layer.md`, `image-app.md`, `tracing.md`.
> Skill files under `.agents/skills/` (`auto-navigation`, `generated-form`) contain the same conventions in skill format.

## Commands

- `npm run dev` — start dev server (runs `copy` first via `predev`)
- `npm run build` — production build (runs `copy` first via `prebuild`)
- `npm run copy` — copies Monaco editor assets to `public/assets/monaco` and regenerates editor type definitions via `scripts/combine-editor-types.mjs`; re-run this after changing Function-editor/Monaco-related type definitions
- `npm run lint` — `next lint`
- `npm test` / `npm run test:run` — Jest (`test:run` uses `--runInBand`). Only `*.test.ts` and `*.spec.ts` files are picked up (see `jest.config.cjs`), using `ts-jest` in ESM mode.
- Single test file: `npx jest path/to/file.spec.ts`
- `npx patch-package` runs automatically via `postinstall`; it patches `@point-of-sale/webusb-receipt-printer` for non-browser import paths (see `PATCH_PACKAGE.md`) — don't remove the `patches/` directory.

The `@fsarch` npm scope resolves against GitHub Packages (`.npmrc`), so installs need a `NODE_AUTH_TOKEN`/GitHub auth in CI-like environments.

## Architecture

This is a **single Next.js application that hosts many embedded "apps"** (Frontier, Function, Printer, Image, Email, Product, Watchtower, Material Tracing, Customer Communication, PDF Render, Bot Protection, AI, Datatable, Metric, Custom-App, …), each backed by its own configurable backend service. There is no per-app repo — everything lives in this one Next.js tree and is wired together at runtime through `config.yml`.

### Request flow and multi-tenancy of services

- `config.yml` at the repo root lists backend `services` (each with `type`, `id`, `url`, and sometimes extra fields like `worker_url`) plus `defaults` (which service instance is used when a URL doesn't specify one) and theme colors.
- `src/utils/configuration.type.ts` defines `EServiceType` and the per-service config type union (`TServiceConfiguration`). Adding a new backend type starts here.
- `src/utils/configuration.utils.ts` parses and caches `config.yml` per process — **changing `config.yml` normally requires a dev server restart**.
- `src/proxy.ts` parses incoming URLs of the shape `/<app>/<serviceId>/...` and injects `X-Service-Id`, `X-Service-Type`, `X-Service-Path`, and `X-Original-URL` headers. Most server-side utilities (navigation, `fetchService`) depend on these headers being present.
- `src/utils/fetchService.ts` is the required HTTP client for backend calls from Server Components, Server Actions, and service files: it resolves the target base URL from the request headers + `config.yml` and injects the bearer token automatically. Never use plain `fetch` for backend/service calls.
- To call a *different* app's default backend from within another app's code, use `getDefaultServiceId()` from `configuration.utils` and pass explicit `X-Service-Id`/`X-Service-Type` headers to `fetchService` (example: `src/components/apps/pdf-render/PdfRenderForm.server-action.ts`).
- `getAccessToken()` (`src/utils/getAccessToken.ts`) is the server-side source of the current access token for cases `fetchService` doesn't cover.

### Per-app structure (the repeating pattern)

For an app named `<app>`:
- `src/app/(with-header)/<app>/page.tsx` — root route; if only one service instance is configured, redirects to `/<app>/<serviceId>`.
- `src/app/(with-header)/<app>/[serviceId]/...` — the app's actual routed pages, service-scoped.
- `src/components/apps/<app>/` — app-specific reusable UI components.
- `src/services/<app>/<app>.service.ts` (+ `.type.ts`, optionally `.forms.ts`) — all backend-call logic for the app; routes/components consume these, never build backend URLs themselves.
- App registration (name, `basePath`, sidebar `navigation`/`navigations`/`routes`) lives centrally in `src/constants/apps.ts` (types in `src/constants/app.type.ts`), not scattered in JSX. `src/utils/app/navigation.utils.ts` resolves the sidebar via `path-to-regexp` route matching (last match wins) against `X-Service-Path`; JSONata expressions can be used for dynamic sidebar paths with access to `params.*`.
- To also get a tile on the dashboard home page, add an entry in `src/utils/app/app.utils.ts`.
- Full step-by-step with checklist: `docs/new-app.md`.

### Custom-app system

Some services have `type: custom-app` in `config.yml` with a `path` pointing to a YAML file under `addons/`. `src/components/apps/custom-app/custom-app.utils.ts` loads and validates these with Joi and supports JSONata for navigation, data sources, and endpoint definitions — this is a data-driven way to add an app without writing routes/components. When touching custom apps, check both the addon YAML and the renderer/types under `src/components/apps/custom-app/`.

### Forms

- Prefer `GeneratedForm` (`src/components/universals/forms/generated/GeneratedForm.component.tsx`, server-only) for create/update/delete flows: it's a declarative `TGeneratedFormDefinition` (inputs, `initialValues`, `endpoint`, optional `dataSources`/`postEndpointActions`) that calls `fetchService` directly and auto-refreshes on submit. Full input-type reference: `docs/generated-form.md` / `src/components/universals/forms/generated/README.md`.
- When `GeneratedForm` doesn't fit (complex client interaction/dynamic conditional behavior), use the fallback pattern: Formik client component + Server Action + service-layer call (example: `src/components/apps/pdf-render/PdfRenderForm.tsx` + `.server-action.ts`).
- Alerts/confirmations always go through `useOpenDialog()` + `AlertDialog` (example: `src/app/(with-header)/material-tracing/[serviceId]/_components/actions/ActionButtonClient.component.tsx`), not ad-hoc dialogs.
- Before building new UI primitives, check `src/components/universals/` (buttons, inputs, selects, lists, page wrappers, etc.) — they're reused repo-wide.

### Auth

NextAuth + Keycloak/OIDC: config in `src/constants/auth-options.ts`, route handler at `src/app/api/auth/[...nextauth]/route.ts`.

### Deployment

Docker build runs on Node Alpine and needs native graphics libs (`cairo`, `pango`, `jpeg`, `libpng`, ...) — see `Dockerfile`. CI (`.github/workflows/`) runs tests across Node 18/20/24, then a separate workflow builds the Next.js app with prebuilt artifacts (`.next/standalone`, `.next/static`, `node_modules`) and pushes a multi-arch Docker image on `main`/`release`.
