# AGENTS.md

## Überblick
- Dieses Repository ist eine **Next.js-App mit mehreren eingebetteten Fach-Apps**; die konkreten Backends werden zur Laufzeit über `config.yml` verdrahtet.
- Service-Typen/Config-Formen stehen in `src/utils/configuration.type.ts`, App-Definitionen (`name`, `basePath`, Navigation) in `src/constants/apps.ts`.
- Die Dashboard-Startseite `src/app/(with-header)/page.tsx` zeigt App-Tiles plus Custom-Apps und leitet ohne Session zu NextAuth um.
## Routing- und Service-Modell
- Normales Muster: `src/app/(with-header)/<app>/[serviceId]/...`; die Root-Seite ohne `serviceId` redirectet meist auf die erste konfigurierte Instanz, z. B. `src/app/(with-header)/function/page.tsx`.
- `src/proxy.ts` extrahiert aus `/<app>/<serviceId>/...` die Header `X-Service-Id`, `X-Service-Type`, `X-Service-Path` und `X-Original-URL`; viele Server-Utilities setzen diese voraus.
- Verwende für interne Links innerhalb eines Services `src/utils/getServiceLocalUrl.ts`, damit `serviceId` und Typ im Pfad erhalten bleiben.
## Datenfluss und Backend-Zugriff
- In **Server Components, Server Actions und Service-Layern** `src/utils/fetchService.ts` statt `fetch` verwenden: es löst die Basis-URL über `serviceId`/Headers aus `config.yml` auf und injiziert automatisch den Bearer-Token.
- Fachspezifische Backend-Aufrufe liegen in `src/services/<app>/...` (Beispiel: `src/services/function/function.service.ts`). Routen/Komponenten konsumieren diese Services, statt URLs selbst zusammenzubauen.
- Service-übergreifende Aktionen können per `getDefaultServiceId()` auf das Default-Backend einer anderen App wechseln; Beispiel: `src/components/apps/pdf-render/PdfRenderForm.server-action.ts`.
## Konfiguration
- `config.yml` ist die zentrale Laufzeitquelle für `services`, `defaults` und Theme-Farben. Service-Einträge enthalten mindestens `type`, `id`, `url`; manche Typen nutzen zusätzliche Felder wie `worker_url` oder bei Custom-Apps `path`.
- `src/utils/configuration.utils.ts` cached die eingelesene YAML-Konfiguration pro Prozess. Änderungen an `config.yml` erfordern daher typischerweise einen Neustart des Dev-Servers.
## UI- und Formular-Konventionen
- Für Create/Update/Delete-Flows zuerst prüfen, ob `GeneratedForm` passt (`src/components/universals/forms/generated/GeneratedForm.component.tsx`). Beispiel: `src/app/(with-header)/function/[serviceId]/page.tsx` verwendet ein definitionsbasiertes Formular zum Erstellen.
- Wenn `GeneratedForm` nicht passt, ist das Standardmuster: **Client-Komponente mit Formik** + **Server Action** + **Service-Layer**; Beispiel: `src/components/apps/pdf-render/PdfRenderForm.tsx` + `PdfRenderForm.server-action.ts`.
- Für Alerts/Bestätigungen `useOpenDialog()` mit `AlertDialog` verwenden; siehe `src/app/(with-header)/material-tracing/[serviceId]/_components/actions/ActionButtonClient.component.tsx`.
- Vor neuen UI-Bausteinen zuerst `src/components/universals/` prüfen; Buttons, Inputs, Selects, Listen, Seiten-Wrapper usw. werden repo-weit wiederverwendet.
## Custom-App-System
- Custom-Apps sind **datengetrieben**: `config.yml` verweist für Services vom Typ `custom-app` per `path` auf YAML-Dateien unter `addons/...`.
- `src/components/apps/custom-app/custom-app.utils.ts` lädt diese Dateien, validiert sie mit Joi und unterstützt JSONata für Navigation, Datenquellen und Endpoint-Definitionen.
- Wenn du an Custom-Apps arbeitest, prüfe sowohl die Addon-YAML als auch die zugehörigen Typen/Renderer unter `src/components/apps/custom-app/`.
## Auth und externe Integrationen
- Auth läuft über NextAuth + Keycloak/OIDC: `src/constants/auth-options.ts` und `src/app/api/auth/[...nextauth]/route.ts`.
- `getAccessToken()` (`src/utils/getAccessToken.ts`) ist die zentrale serverseitige Quelle für den aktuellen Access Token.
- Die Function-/Printer-Bereiche können neben `url` zusätzlich `worker_url` aus `config.yml` nutzen; diese Felder nicht stillschweigend entfernen.
## Entwickler-Workflows
- Wichtige Skripte aus `package.json`:
  - `npm run dev` / `npm run build` führen über `predev`/`prebuild` automatisch `npm run copy` aus.
  - `npm run copy` kopiert Monaco-Dateien nach `public/assets/monaco` und regeneriert Editor-Definitionen via `scripts/combine-editor-types.mjs`.
  - `npm test` / `npm run test:run` nutzen Jest mit `ts-jest`; erkannt werden nur `*.test.ts` und `*.spec.ts`.
- Wenn du Typdefinitionen oder Monaco-bezogene Dateien für den Function-Editor änderst, danach `npm run copy` erneut ausführen.
- Docker läuft auf Node 22 Alpine; die Container installieren zusätzliche native Grafikbibliotheken (`cairo`, `pango`, `jpeg`, `libpng`, ...). `Dockerfile.ci` erwartet vorgebaute Artefakte (`.next/standalone`, `.next/static`, `node_modules`).
## Neue App hinzufügen
- Ergänze den neuen Service-Typ in `src/utils/configuration.type.ts`.
- Registriere die App in `src/constants/apps.ts` (Name, `basePath`, ggf. Navigation/Routen-Metadaten).
- Falls sie auf der Dashboard-Startseite auftauchen soll, ergänze auch `src/utils/app/app.utils.ts`.
- Lege Routen unter `src/app/(with-header)/<app>/...` an; üblich ist zusätzlich `src/app/(with-header)/<app>/[serviceId]/...`.
- Lege wiederverwendbare UI unter `src/components/apps/<app>/` und Backend-Logik unter `src/services/<app>/` an.
- Ergänze passende Service-Einträge in `config.yml`; bei nur einer Instanz ist ein Redirect von `/<app>` auf `/<app>/<serviceId>` das vorhandene Muster.
