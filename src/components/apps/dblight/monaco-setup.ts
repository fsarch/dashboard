/**
 * Points `@monaco-editor/react` at the locally bundled `monaco-editor`
 * package instead of its default (fetching Monaco from a CDN at runtime) -
 * same approach as the function app's editor
 * (`src/app/(with-header)/function/[serviceId]/function/[functionId]/_components/Editor.component.tsx`).
 * Side-effect only; import this before any `@monaco-editor/react` usage.
 */
import loader from '@monaco-editor/loader';
import * as monaco from 'monaco-editor';

loader.config({ monaco });
