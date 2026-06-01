# App Overview

This folder contains all app routes rendered with the shared header layout.

## Registered Apps

| App | Base Path | Route Folder | App README |
| --- | --- | --- | --- |
| AI | `/ai` | `src/app/(with-header)/ai` | `src/app/(with-header)/ai/README.md` |
| Customer Communication | `/ccm` | `src/app/(with-header)/ccm` | `src/app/(with-header)/ccm/README.md` |
| Custom App | `/custom-app` | `src/app/(with-header)/custom-app` | `src/app/(with-header)/custom-app/README.md` |
| Datatable | `/datatable` | `src/app/(with-header)/datatable` | `src/app/(with-header)/datatable/README.md` |
| Email | `/email` | `src/app/(with-header)/email` | `src/app/(with-header)/email/README.md` |
| Frontier | `/frontier` | `src/app/(with-header)/frontier` | `src/app/(with-header)/frontier/README.md` |
| Function | `/function` | `src/app/(with-header)/function` | `src/app/(with-header)/function/README.md` |
| Image | `/image` | `src/app/(with-header)/image` | `src/app/(with-header)/image/README.md` |
| Material Tracing | `/material-tracing` | `src/app/(with-header)/material-tracing` | `src/app/(with-header)/material-tracing/README.md` |
| PDF Render | `/pdf-render` | `src/app/(with-header)/pdf-render` | `src/app/(with-header)/pdf-render/README.md` |
| Printer | `/printer` | `src/app/(with-header)/printer` | `src/app/(with-header)/printer/README.md` |
| Product | `/product` | `src/app/(with-header)/product` | `src/app/(with-header)/product/README.md` |

## Notes

- App registration source: `src/constants/apps.ts`
- Most apps follow the pattern `/<app>/<serviceId>/...` via `src/app/(with-header)/<app>/[serviceId]`.
- If an app has exactly one configured backend, `page.tsx` in the app root usually redirects to that service route.

