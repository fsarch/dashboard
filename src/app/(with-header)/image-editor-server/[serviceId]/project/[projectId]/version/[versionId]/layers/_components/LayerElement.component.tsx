'use client';

import React from 'react';
import { LayerDto } from '@/services/image-editor-server/image-editor-server.type';

type LayerElementProps = {
  layer: LayerDto;
  // Already resolved against the editor's test parameters (see
  // LayerCanvasEditor's use of resolveBindableValue) - purely presentational.
  resolved: Record<string, unknown>;
};

// Renders one layer's actual visual content using native browser primitives
// (text as a styled div, shapes as a div, html as a sandboxed iframe) so the
// editor genuinely shows what the content looks like, not an abstract
// placeholder box - this is the "WYSIWYG" half of the requirement, the
// Moveable-driven drag/resize/rotate (in LayerCanvasEditor) is the other
// half. It does not attempt to byte-match the backend's @napi-rs/canvas +
// Puppeteer rendering pixel-for-pixel (fonts in particular may render
// slightly differently) - the "Vorschau rendern" action on the version page
// remains the source of truth for an exact preview.
const LayerElement: React.FunctionComponent<LayerElementProps> = ({ layer, resolved }) => {
  switch (layer.type) {
    case 'text':
      return (
        <div
          style={{
            fontFamily: (resolved.fontFamily as string) || 'sans-serif',
            fontSize: `${(resolved.fontSize as number) ?? 16}px`,
            color: (resolved.color as string) || '#000000',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {(resolved.content as string) ?? ''}
        </div>
      );

    case 'shape': {
      const width = (resolved.width as number) ?? 0;
      const height = (resolved.height as number) ?? 0;
      const strokeWidth = (resolved.strokeWidth as number) ?? 1;

      return (
        <div
          style={{
            width,
            height,
            background: (resolved.fillColor as string) || undefined,
            border: resolved.strokeColor ? `${strokeWidth}px solid ${resolved.strokeColor}` : undefined,
            borderRadius: resolved.shape === 'ellipse' ? '50%' : 0,
            boxSizing: 'border-box',
          }}
        />
      );
    }

    case 'image': {
      const width = (resolved.width as number) ?? 0;
      const height = (resolved.height as number) ?? 0;
      const image = resolved.image as { type: 'base64'; value: string } | undefined;

      return image ? (
        // eslint-disable-next-line @next/next/no-img-element -- base64 layer content, not an optimizable static asset
        <img src={`data:image/png;base64,${image.value}`} width={width} height={height} alt={layer.name} draggable={false} />
      ) : (
        <div style={{ width, height, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          kein Bild
        </div>
      );
    }

    case 'html': {
      const width = (resolved.width as number) ?? 0;
      const height = (resolved.height as number) ?? 0;

      // Confirmed via live testing (Chrome 152): without an explicit
      // color-scheme, this browser's iframe-canvas-background heuristic
      // ignores `background-color: transparent` entirely and paints an
      // opaque white canvas regardless - `getComputedStyle` on the iframe
      // still reports `transparent`, but the actual composited pixels are
      // solid white, so this bug is invisible to CSS/DOM inspection and
      // only shows up visually. Declaring `color-scheme: light dark` turns
      // that heuristic off and lets the real (transparent, or whatever the
      // layer's own HTML sets) background paint correctly. This is prepended
      // ahead of the layer's own HTML - not injected into/replacing it - so
      // it can't override a background-color the layer author actually set.
      // Also mirrors the backend's own reset (html-layer-renderer.service.ts'
      // RESET_STYLE): Chromium's UA stylesheet gives `body` an 8px margin by
      // default, which would otherwise offset the layer's content from the
      // box's (0,0) origin - unlike every other layer type, none of which
      // have an implicit offset. `overflow:hidden` additionally suppresses
      // the iframe's own scrollbar for layer HTML that ends up a few pixels
      // taller/wider than its own viewport (e.g. `width:100vw` plus
      // `padding` under default content-box sizing) - harmless in the
      // backend's actual PNG output (Puppeteer screenshots never render
      // scrollbar UI), but visibly ugly in this live iframe preview.
      // Prepended, not injected into the layer's own HTML, so an author-set
      // margin/padding/overflow of equal specificity still wins the cascade.
      const srcDoc = `<meta name="color-scheme" content="light dark"><style>html,body{margin:0;padding:0;overflow:hidden}</style>${(resolved.html as string) ?? ''}`;

      return (
        // backgroundColor: 'transparent' matches the backend's
        // html-layer-renderer.service.ts, which screenshots with Puppeteer's
        // `omitBackground: true` so the layer composites onto the canvas
        // without an opaque backdrop. Without it, the iframe's own document
        // paints the browser's default white canvas behind any content that
        // doesn't set its own background - an explicit background the HTML
        // itself sets (e.g. `body { background: red }`) still shows through
        // normally, exactly as it would in the actual render.
        <iframe
          srcDoc={srcDoc}
          sandbox=""
          style={{ width, height, border: 'none', pointerEvents: 'none', backgroundColor: 'transparent' }}
          title={layer.name}
        />
      );
    }

    default:
      return null;
  }
};

export default LayerElement;
