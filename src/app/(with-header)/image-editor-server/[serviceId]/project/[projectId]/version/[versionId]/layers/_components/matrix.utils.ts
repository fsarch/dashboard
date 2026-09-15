import { BindableAffineMatrix } from '@/services/image-editor-server/image-editor-server.type';

export type TAffineMatrix = { a: number; b: number; c: number; d: number; e: number; f: number };

export const IDENTITY_MATRIX: TAffineMatrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

export function toCssMatrix({ a, b, c, d, e, f }: TAffineMatrix): string {
  return `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`;
}

/**
 * Reads the resolved CSS transform matrix directly off a DOM element via
 * getComputedStyle. Used after a *drag* gesture: react-moveable's own
 * `onDrag`/`transform` output already correctly threads a pre-existing
 * rotation through the translate (that's the library's documented `target
 * .style.transform = transform` recipe) - hand-rolling that ourselves from
 * `beforeTranslate` double-applies/misapplies the rotation and makes
 * rotated layers drift sideways while dragging. So for drag we let Moveable
 * do the transform math, and only afterwards read the result back here to
 * convert into our persisted {x,y,rotationDeg} model. Resize/rotate still
 * use composeMatrix/decomposeMatrix directly (see LayerCanvasEditor) since
 * *there* we deliberately override Moveable's default pivot to always be
 * the layer's center.
 */
export function readCssMatrix(target: HTMLElement): TAffineMatrix {
  const transform = getComputedStyle(target).transform;

  if (!transform || transform === 'none') {
    return IDENTITY_MATRIX;
  }

  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) {
    return IDENTITY_MATRIX;
  }

  const [a, b, c, d, e, f] = match[1].split(',').map((value) => parseFloat(value.trim()));
  return { a, b, c, d, e, f };
}

export function toBindableAffineMatrix(matrix: TAffineMatrix): BindableAffineMatrix {
  return {
    a: { type: 'constant', value: matrix.a },
    b: { type: 'constant', value: matrix.b },
    c: { type: 'constant', value: matrix.c },
    d: { type: 'constant', value: matrix.d },
    e: { type: 'constant', value: matrix.e },
    f: { type: 'constant', value: matrix.f },
  };
}

/**
 * The editor's actual source of truth for a layer's placement - NOT the raw
 * a,b,c,d,e,f matrix. `x`/`y` is where the layer's *unrotated* top-left
 * corner would sit (stable across both resize and rotation); `rotationDeg`
 * is the rotation angle in degrees, always applied around the layer's own
 * center (width/2, height/2), never around (0,0).
 *
 * The backend's rendering pipeline (`ctx.setTransform(a,b,c,d,e,f)` applied
 * before drawing a box anchored at local (0,0)-(width,height), see
 * image-editor-server's canvas-compositor.service.ts) has no concept of
 * "center" or "x/y" at all - it only ever sees the final composed matrix.
 * All the center-pivot math therefore has to happen here, every time
 * *any* of x/y/rotation/width/height changes, and the full matrix gets
 * re-persisted - never just one component in isolation. Patching e/f alone
 * after a resize (keeping a stale a,b,c,d) would silently rotate the shape
 * around the *old* center and make it visibly jump; recomputing the whole
 * matrix from these five stable numbers avoids that entirely.
 */
export type TLayerGeometry = {
  x: number;
  y: number;
  rotationDeg: number;
  width: number;
  height: number;
};

/**
 * Composes the final backend-compatible matrix from stable geometry.
 * Derivation: a local point p is first centered (p - center), rotated
 * around the origin, then placed back at (x,y) + center. Expanding
 * `R(θ)·(p - center) + center + (x,y)` into standard a,b,c,d,e,f form
 * gives the e,f below - with rotationDeg = 0 this reduces exactly to
 * `e = x, f = y` (pure translation), so it's a strict superset of the
 * simpler translation-only matrices used elsewhere (e.g. freshly created
 * layers, whose transformationMatrix starts as the identity + translate).
 */
export function composeMatrix({ x, y, rotationDeg, width, height }: TLayerGeometry): TAffineMatrix {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = width / 2;
  const cy = height / 2;

  return {
    a: cos,
    b: sin,
    c: -sin,
    d: cos,
    e: x + cx - (cos * cx - sin * cy),
    f: y + cy - (sin * cx + cos * cy),
  };
}

/**
 * Inverse of composeMatrix - recovers {x, y, rotationDeg} given the current
 * width/height. Assumes the matrix is a pure rotation+translation (no
 * scale/skew) - true for anything this editor ever wrote; a matrix set
 * some other way (e.g. directly via the API) with real scale/skew would
 * decompose approximately, which is an accepted limitation (scale is
 * expected to live in options.width/height, never in the matrix - see
 * requirements.md).
 */
export function decomposeMatrix(matrix: TAffineMatrix, width: number, height: number): TLayerGeometry {
  const rotationRad = Math.atan2(matrix.b, matrix.a);
  const cos = Math.cos(rotationRad);
  const sin = Math.sin(rotationRad);
  const cx = width / 2;
  const cy = height / 2;

  return {
    x: matrix.e - cx + (cos * cx - sin * cy),
    y: matrix.f - cy + (sin * cx + cos * cy),
    rotationDeg: (rotationRad * 180) / Math.PI,
    width,
    height,
  };
}
