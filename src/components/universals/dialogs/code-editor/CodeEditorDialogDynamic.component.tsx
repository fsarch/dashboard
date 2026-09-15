'use client';

import dynamic from 'next/dynamic';
import { TDialogComponent } from '@/components/universals/dialog/dialog.type';
import { TCodeEditorDialogValue } from './CodeEditorDialog.component';

// monaco-editor references `window` at module-eval time, so it can't be
// server-rendered - eagerly importing CodeEditorDialog.component (even
// though it's itself 'use client') still gets pulled into the SSR pass of
// whatever page imports it, crashing with "window is not defined" (Next.js
// recovers by silently falling back to client-only rendering, but that's a
// visible console error and wasted work on every load). `ssr: false` here
// defers the import (and therefore Monaco's ~2MB) to the client, and only
// once this dialog is actually opened - mirrors function/[functionId]/
// _components/EditorDynamic.component.tsx, the same fix for the same
// library in the one other place this app already uses Monaco.
//
// `next/dynamic` types its return as a generic ComponentType (which also
// covers class components), which TDialogComponent (a plain React.FC
// alias) doesn't structurally accept - the runtime shape is identical
// either way (openDialog only ever renders it as <Component value=.../>),
// so this cast just bridges the two type conventions.
const CodeEditorDialogDynamic = dynamic(() => import('./CodeEditorDialog.component'), {
  ssr: false,
}) as TDialogComponent<TCodeEditorDialogValue, string>;

export default CodeEditorDialogDynamic;
