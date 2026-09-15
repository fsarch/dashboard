'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Moveable, { OnDrag, OnDragEnd, OnResize, OnResizeEnd, OnRotate, OnRotateEnd } from 'react-moveable';
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Section from '@/components/universals/section/Section';
import List from '@/components/universals/list/List';
import ListItem from '@/components/universals/list/ListItem';
import Icon from '@/components/universals/icon/Icon.component';
import clsx from 'clsx';
import {
  BindableAffineMatrix,
  LayerDto,
  LayerOptions,
  ParameterDto,
} from '@/services/image-editor-server/image-editor-server.type';
import { resolveBindableValue } from '@/services/image-editor-server/bindable-value.utils';
import { flattenParameterPaths } from './parameter-paths.utils';
import { composeMatrix, decomposeMatrix, IDENTITY_MATRIX, readCssMatrix, TAffineMatrix, TLayerGeometry, toBindableAffineMatrix, toCssMatrix } from './matrix.utils';
import LayerElement from './LayerElement.component';
import LayerPropertiesPanel from './LayerPropertiesPanel.component';
import LayerGeometryPanel from './LayerGeometryPanel.component';
import TestParametersPanel from './TestParametersPanel.component';
import AddLayerForm from './AddLayerForm.component';
import {
  deleteLayerAction,
  updateLayerGeometryAction,
  updateLayerGeometryAndSizeAction,
  updateLayerHiddenAction,
  updateLayerNameAction,
  updateLayerOptionsAction,
  updateLayerOrderAction,
} from './LayerCanvasEditor.server-action';
import { colors } from '@/app/_styles/colors';
import styles from './LayerCanvasEditor.module.scss';

type LayerCanvasEditorProps = {
  projectId: string;
  versionId: string;
  version: { width: number; height: number };
  isEditable: boolean;
  initialLayers: LayerDto[];
  parameters: ParameterDto[];
};

// Soft cap on how tall the preview may get relative to the viewport, so an
// extreme portrait-format project doesn't force a huge scroll area - width
// is *not* capped by a constant like this, it's measured live from the
// actual available space (see canvasAreaRef/ResizeObserver below), so the
// preview always fits within its column instead of overflowing to the side
// on narrow/mobile viewports.
const MAX_CANVAS_DISPLAY_HEIGHT_RATIO = 0.7;

function resolveMatrix(matrix: BindableAffineMatrix, testParameters: Record<string, unknown>): TAffineMatrix {
  return {
    a: resolveBindableValue(matrix.a, testParameters) ?? IDENTITY_MATRIX.a,
    b: resolveBindableValue(matrix.b, testParameters) ?? IDENTITY_MATRIX.b,
    c: resolveBindableValue(matrix.c, testParameters) ?? IDENTITY_MATRIX.c,
    d: resolveBindableValue(matrix.d, testParameters) ?? IDENTITY_MATRIX.d,
    e: resolveBindableValue(matrix.e, testParameters) ?? IDENTITY_MATRIX.e,
    f: resolveBindableValue(matrix.f, testParameters) ?? IDENTITY_MATRIX.f,
  };
}

function resolveOptions(options: LayerOptions, testParameters: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(options).map(([key, bindable]) => [key, resolveBindableValue(bindable as never, testParameters)]),
  );
}

function isFullyConstant(matrix: BindableAffineMatrix): boolean {
  return [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f].every((v) => v.type === 'constant');
}

// Only valid to call when isFullyConstant(matrix) - every BindableValue's
// .value is then guaranteed to already be the plain number, not a variable path.
function rawConstantMatrix(matrix: BindableAffineMatrix): TAffineMatrix {
  return {
    a: matrix.a.value as number,
    b: matrix.b.value as number,
    c: matrix.c.value as number,
    d: matrix.d.value as number,
    e: matrix.e.value as number,
    f: matrix.f.value as number,
  };
}

function hasConstantSize(layer: LayerDto): boolean {
  const options = layer.options as Record<string, { type: string } | undefined>;
  return options.width?.type === 'constant' && options.height?.type === 'constant';
}

function constantSize(layer: LayerDto): { width: number; height: number } | null {
  if (!hasConstantSize(layer)) return null;
  const options = layer.options as unknown as Record<string, { value: number }>;
  return { width: options.width.value, height: options.height.value };
}

type SortableLayerRowProps = {
  layer: LayerDto;
  index: number;
  rowCount: number;
  selected: boolean;
  isEditable: boolean;
  onSelect: () => void;
  onReorder: (direction: 'up' | 'down') => void;
  onToggleHidden: () => void;
};

// A single row in the "Ebenen (Reihenfolge)" list. useSortable can't be
// called from inside the parent's .map() (hooks can't run in a loop), so
// each row is its own component. The drag handle (⠿) is the only element
// carrying dnd-kit's pointer listeners - the row itself only gets the
// (non-interactive) `attributes` for accessibility, so a plain click still
// selects the layer and the ▲/▼ buttons still work untouched by dnd-kit.
const SortableLayerRow: React.FunctionComponent<SortableLayerRowProps> = ({
  layer,
  index,
  rowCount,
  selected,
  isEditable,
  onSelect,
  onReorder,
  onToggleHidden,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: layer.id,
    disabled: !isEditable,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.layerListItem}
      onClick={onSelect}
      {...attributes}
    >
      <ListItem
        left={isEditable ? (
          <button
            type="button"
            className={styles.dragHandle}
            title="Ziehen zum Sortieren"
            onClick={(e) => e.stopPropagation()}
            {...listeners}
          >
            ⠿
          </button>
        ) : undefined}
        right={isEditable ? (
          <div className={styles.rowActions}>
            {selected && (
              <span className={styles.selectedIcon} title="Wird bearbeitet">
                <Icon icon="edit" />
              </span>
            )}
            <button
              type="button"
              className={styles.visibilityToggle}
              onClick={(e) => { e.stopPropagation(); onToggleHidden(); }}
              title={layer.hidden ? 'Ebene einblenden' : 'Ebene ausblenden'}
            >
              <Icon icon={layer.hidden ? 'eye-slash' : 'eye'} />
            </button>
            <div className={styles.reorderButtons}>
              <button
                type="button"
                disabled={index === 0}
                onClick={(e) => { e.stopPropagation(); onReorder('up'); }}
                title="Nach oben"
              >
                ▲
              </button>
              <button
                type="button"
                disabled={index === rowCount - 1}
                onClick={(e) => { e.stopPropagation(); onReorder('down'); }}
                title="Nach unten"
              >
                ▼
              </button>
            </div>
          </div>
        ) : undefined}
      >
        <span className={layer.hidden ? styles.hiddenLayerLabel : undefined}>
          {layer.order}. {layer.name} ({layer.type})
        </span>
      </ListItem>
    </div>
  );
};

// The Moveable-driven WYSIWYG canvas. Every layer is positioned/rotated per
// its transformationMatrix and sized per its options.width/height, resolved
// live against admin-entered test parameters. Geometry (position, rotation,
// size) is tracked as an explicit {x, y, rotationDeg, width, height} model
// (see matrix.utils.ts) rather than treating the raw matrix as the source
// of truth - this is what lets rotation always pivot around the layer's own
// center and keeps a resize from silently moving a rotated layer, while the
// backend still only ever sees the final composed matrix it already
// understands (no API change needed).
const LayerCanvasEditor: React.FunctionComponent<LayerCanvasEditorProps> = ({
  projectId,
  versionId,
  version,
  isEditable,
  initialLayers,
  parameters,
}) => {
  const [layers, setLayers] = useState<LayerDto[]>([...initialLayers].sort((a, b) => a.order - b.order));
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [testParameters, setTestParameters] = useState<Record<string, unknown>>({});

  const layerRefs = useRef(new Map<string, HTMLDivElement>());
  const setLayerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) layerRefs.current.set(id, el);
    else layerRefs.current.delete(id);
  }, []);

  // Captured at the start of a drag/resize/rotate gesture and updated on
  // every tick; consumed once the gesture ends. Only one gesture can be in
  // flight at a time (Moveable is only ever attached to one target).
  const gestureGeometryRef = useRef<TLayerGeometry | null>(null);

  // Moveable positions its selection/handle overlay with `position:
  // absolute` inside its `container` (default: its own DOM parent - here,
  // `<main>`), on the assumption that `container` is itself a positioned
  // element (position != static) so the browser anchors the overlay to it.
  // This dashboard's page shell's <main> (the element that actually
  // scrolls - the app header/sidebar stay fixed, the window itself never
  // scrolls) is `position: static`, so the browser instead resolves the
  // overlay's offsetParent to <body> (confirmed via
  // getComputedStyle/offsetParent) - outside the scrolling element
  // entirely. The overlay's *coordinates* are computed correctly (they're
  // getBoundingClientRect()-based, so react to scroll immediately), but
  // rendered relative to the wrong anchor, so it visibly stays put on
  // screen while the actual layer scrolls underneath it. No amount of
  // telling Moveable to recompute (`updateRect()`, verified by calling it
  // directly, every frame, after locating the live instance via its React
  // fiber - still had zero visible effect) fixes a positioning-context
  // mismatch; only removing the mismatch does. Fix: give Moveable its own
  // `position: relative` container *inside* this component (the
  // `.moveableContainer` div below, passed as `container`) - a normal
  // descendant of <main>'s scrollable content, so the overlay now scrolls
  // via plain CSS along with everything else, no JS tracking required.
  const moveableContainerRef = useRef<HTMLDivElement>(null);
  const moveableRef = useRef<Moveable>(null);

  // canvasAreaRef wraps the preview with no fixed size of its own (see
  // .canvasArea in the stylesheet) - it just fills whatever the responsive
  // grid layout gives it (full width on mobile, the left grid track next
  // to the sidebar on desktop). Measuring *that* rather than hard-coding a
  // max width/height keeps the preview from ever running wider than its
  // column (and therefore never past 100vw, since the layout itself never
  // exceeds the viewport width).
  const canvasAreaRef = useRef<HTMLDivElement>(null);
  const [canvasAreaSize, setCanvasAreaSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = canvasAreaRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;

      // Ignore sub-pixel deltas: `.main`'s scrollbar-gutter (see
      // DefaultPage.module.scss) keeps a scrollbar toggle from changing
      // this width at all, but this still guards against float-rounding
      // jitter between ResizeObserver's own measurement and the CSS pixel
      // values it feeds back into (zoom -> canvas size -> back here) -
      // setting state on every sub-pixel wobble would re-render every
      // frame without ever visibly changing anything.
      setCanvasAreaSize((prev) => (
        prev && Math.abs(prev.width - width) < 1 && Math.abs(prev.height - height) < 1
          ? prev
          : { width, height }
      ));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const parameterPaths = useMemo(() => flattenParameterPaths(parameters), [parameters]);

  // The sidebar list shows layers frontmost-first (highest `order` at the
  // top), matching how the layer sits in the rendered image, while `layers`
  // itself stays ascending (see handleReorder above and the WYSIWYG preview
  // below, both of which rely on ascending = back-to-front paint order).
  const displayLayers = useMemo(() => [...layers].sort((a, b) => b.order - a.order), [layers]);

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;
  const selectedTarget = selectedLayerId ? layerRefs.current.get(selectedLayerId) ?? null : null;

  const zoom = canvasAreaSize
    ? Math.min(
      1,
      canvasAreaSize.width / version.width,
      (typeof window === 'undefined' ? Infinity : window.innerHeight * MAX_CANVAS_DISPLAY_HEIGHT_RATIO) / version.height,
    )
    // Before the first ResizeObserver measurement, render at a tiny scale
    // rather than full size - avoids a one-frame flash of an oversized,
    // overflowing canvas on first paint.
    : 0.01;

  const updateLayerLocal = useCallback((layerId: string, patch: Partial<LayerDto>) => {
    setLayers((prev) => prev.map((l) => (l.id === layerId ? { ...l, ...patch } : l)));
  }, []);

  /** The width/height to pivot rotation/resize around: options.width/height for shape/image/html, the live-rendered box size for text (which has no stored size). */
  const sizeForGeometry = useCallback((layer: LayerDto): { width: number; height: number } => {
    const constant = constantSize(layer);
    if (constant) return constant;
    const target = layerRefs.current.get(layer.id);
    return { width: target?.offsetWidth ?? 0, height: target?.offsetHeight ?? 0 };
  }, []);

  const persistGeometry = useCallback(async (layerId: string, geometry: TLayerGeometry) => {
    const matrix = composeMatrix(geometry);
    const bindable = toBindableAffineMatrix(matrix);
    updateLayerLocal(layerId, { transformationMatrix: bindable });
    await updateLayerGeometryAction(projectId, versionId, layerId, bindable);
  }, [projectId, versionId, updateLayerLocal]);

  const persistGeometryAndSize = useCallback(async (layerId: string, geometry: TLayerGeometry) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    const matrix = composeMatrix(geometry);
    const bindableMatrix = toBindableAffineMatrix(matrix);
    const nextOptions = {
      ...layer.options,
      width: { type: 'constant', value: Math.round(geometry.width) },
      height: { type: 'constant', value: Math.round(geometry.height) },
    } as LayerOptions;

    updateLayerLocal(layerId, { transformationMatrix: bindableMatrix, options: nextOptions });
    await updateLayerGeometryAndSizeAction(projectId, versionId, layerId, bindableMatrix, nextOptions);
  }, [projectId, versionId, layers, updateLayerLocal]);

  const handleChangeOptions = useCallback(async (layerId: string, options: LayerOptions) => {
    updateLayerLocal(layerId, { options });
    await updateLayerOptionsAction(projectId, versionId, layerId, options);
  }, [projectId, versionId, updateLayerLocal]);

  const handleChangeName = useCallback(async (layerId: string, name: string) => {
    updateLayerLocal(layerId, { name });
    await updateLayerNameAction(projectId, versionId, layerId, name);
  }, [projectId, versionId, updateLayerLocal]);

  // Deselect a layer being hidden - it no longer renders on the canvas
  // (see the WYSIWYG loop below), so Moveable would otherwise be left
  // attached to a target that's no longer there.
  const handleToggleHidden = useCallback(async (layerId: string) => {
    const layer = layers.find((l) => l.id === layerId);
    if (!layer) return;

    const nextHidden = !layer.hidden;
    updateLayerLocal(layerId, { hidden: nextHidden });
    if (nextHidden && selectedLayerId === layerId) setSelectedLayerId(null);
    await updateLayerHiddenAction(projectId, versionId, layerId, nextHidden);
  }, [projectId, versionId, layers, selectedLayerId, updateLayerLocal]);

  const handleDelete = useCallback(async (layerId: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== layerId));
    setSelectedLayerId(null);
    await deleteLayerAction(projectId, versionId, layerId);
  }, [projectId, versionId]);

  // Renumbers layers to sequential 0..n-1 order after swapping two adjacent
  // (by current order) entries - robust even if orders were ever gappy or
  // duplicated, and only persists entries whose order actually changed.
  // Deliberately NOT done inside a setLayers(prev => ...) updater: updater
  // functions must stay pure (React may invoke them more than once, e.g.
  // under StrictMode), and firing network requests from inside one would
  // risk double-submitting the PATCH calls.
  //
  // `layers` itself always stays sorted ascending by `order` (index 0 =
  // backmost), matching the canvas-compositor's paint order and the WYSIWYG
  // preview's DOM stacking below - only the sidebar list displays it
  // reversed (frontmost first, see `displayLayers`), so "up" in that list
  // means moving a layer towards the front, i.e. *increasing* its order.
  const handleReorder = useCallback((layerId: string, direction: 'up' | 'down') => {
    const sorted = [...layers].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex((l) => l.id === layerId);
    const swapIndex = direction === 'up' ? index + 1 : index - 1;
    if (index === -1 || swapIndex < 0 || swapIndex >= sorted.length) return;

    [sorted[index], sorted[swapIndex]] = [sorted[swapIndex], sorted[index]];
    const renumbered = sorted.map((layer, i) => ({ ...layer, order: i }));
    const changed = renumbered.filter((layer) => layer.order !== layers.find((l) => l.id === layer.id)?.order);

    setLayers(renumbered);
    void Promise.all(changed.map((layer) => updateLayerOrderAction(projectId, versionId, layer.id, layer.order)));
  }, [layers, projectId, versionId]);

  const layerListSensors = useSensors(
    // A small activation distance keeps a plain click on the row (to select
    // a layer) or on the ▲/▼ buttons from being swallowed as a drag - the
    // pointer has to move a few pixels first before dnd-kit takes over.
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
  );

  // Same renumbering approach as handleReorder above, generalized to an
  // arbitrary drop position instead of a single up/down step. `arrayMove`
  // operates on `displayLayers` (frontmost-first, matching what's on
  // screen), so the dropped-at index there directly becomes the new
  // front-to-back position; renumbering then re-sort back to ascending
  // before setLayers, since `layers` itself must stay ascending (see the
  // comment on handleReorder).
  const handleLayerDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = displayLayers.findIndex((l) => l.id === active.id);
    const newIndex = displayLayers.findIndex((l) => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedDisplay = arrayMove(displayLayers, oldIndex, newIndex);
    const renumbered = reorderedDisplay.map((layer, i) => ({ ...layer, order: reorderedDisplay.length - 1 - i }));
    const changed = renumbered.filter((layer) => layer.order !== layers.find((l) => l.id === layer.id)?.order);

    setLayers([...renumbered].sort((a, b) => a.order - b.order));
    void Promise.all(changed.map((layer) => updateLayerOrderAction(projectId, versionId, layer.id, layer.order)));
  }, [displayLayers, layers, projectId, versionId]);

  // Drag deliberately does NOT go through composeMatrix/gestureGeometryRef
  // like resize/rotate do: react-moveable's own `transform` output during a
  // plain drag already correctly carries forward whatever rotation the
  // layer already had (that's its documented `target.style.transform =
  // transform` recipe) - recomputing it ourselves from `beforeTranslate`
  // fought with that and made rotated layers drift sideways instead of
  // following the cursor. So for drag we trust Moveable during the gesture
  // and only decompose the *result* back into our {x,y,rotationDeg} model
  // once the gesture ends, purely to get it into backend/persisted form.
  const handleDrag = useCallback(({ target, transform }: OnDrag) => {
    (target as HTMLElement).style.transform = transform;
  }, []);

  const handleDragEnd = useCallback(({ target, isDrag }: OnDragEnd) => {
    if (!isDrag || !selectedLayer) return;
    const size = sizeForGeometry(selectedLayer);
    const geometry = decomposeMatrix(readCssMatrix(target as HTMLElement), size.width, size.height);
    void persistGeometry(selectedLayer.id, geometry);
  }, [selectedLayer, sizeForGeometry, persistGeometry]);

  const handleResizeStart = useCallback(() => {
    if (!selectedLayer) return;
    const size = sizeForGeometry(selectedLayer);
    gestureGeometryRef.current = decomposeMatrix(rawConstantMatrix(selectedLayer.transformationMatrix), size.width, size.height);
  }, [selectedLayer, sizeForGeometry]);

  const handleResize = useCallback(({ target, width, height }: OnResize) => {
    const start = gestureGeometryRef.current;
    if (!start) return;

    const next: TLayerGeometry = { ...start, width, height };
    gestureGeometryRef.current = next;
    (target as HTMLElement).style.width = `${width}px`;
    (target as HTMLElement).style.height = `${height}px`;
    (target as HTMLElement).style.transform = toCssMatrix(composeMatrix(next));
  }, []);

  const handleResizeEnd = useCallback(({ isDrag }: OnResizeEnd) => {
    if (!isDrag || !selectedLayer || !gestureGeometryRef.current) return;
    void persistGeometryAndSize(selectedLayer.id, gestureGeometryRef.current);
    gestureGeometryRef.current = null;
  }, [selectedLayer, persistGeometryAndSize]);

  const handleRotateStart = useCallback(() => {
    if (!selectedLayer) return;
    const size = sizeForGeometry(selectedLayer);
    gestureGeometryRef.current = decomposeMatrix(rawConstantMatrix(selectedLayer.transformationMatrix), size.width, size.height);
  }, [selectedLayer, sizeForGeometry]);

  const handleRotate = useCallback(({ target, delta }: OnRotate) => {
    const start = gestureGeometryRef.current;
    if (!start) return;

    const next: TLayerGeometry = { ...start, rotationDeg: start.rotationDeg + delta };
    gestureGeometryRef.current = next;
    (target as HTMLElement).style.transform = toCssMatrix(composeMatrix(next));
  }, []);

  const handleRotateEnd = useCallback(({ isDrag }: OnRotateEnd) => {
    if (!isDrag || !selectedLayer || !gestureGeometryRef.current) return;
    void persistGeometry(selectedLayer.id, gestureGeometryRef.current);
    gestureGeometryRef.current = null;
  }, [selectedLayer, persistGeometry]);

  const handleGeometryPanelChange = useCallback((next: TLayerGeometry) => {
    if (!selectedLayer) return;
    if (hasConstantSize(selectedLayer)) {
      void persistGeometryAndSize(selectedLayer.id, next);
    } else {
      void persistGeometry(selectedLayer.id, next);
    }
  }, [selectedLayer, persistGeometry, persistGeometryAndSize]);

  const geometryLocked = selectedLayer ? !isFullyConstant(selectedLayer.transformationMatrix) : false;
  const canResize = selectedLayer ? hasConstantSize(selectedLayer) : false;

  const selectedGeometry: TLayerGeometry | null = useMemo(() => {
    if (!selectedLayer || geometryLocked) return null;
    const size = sizeForGeometry(selectedLayer);
    return decomposeMatrix(rawConstantMatrix(selectedLayer.transformationMatrix), size.width, size.height);
  }, [selectedLayer, geometryLocked, sizeForGeometry]);

  return (
    <div ref={moveableContainerRef} style={{ position: 'relative' }}>
      <TestParametersPanel parameters={parameters} value={testParameters} onChange={setTestParameters} />

      {!isEditable && (
        <Section name="Hinweis" color={colors.lightRed}>
          <p className={styles.lockedNotice}>
            Diese Version ist nicht bearbeitbar (nur die zuletzt erstellte, nicht aktive Version kann editiert werden).
            Ebenen werden hier nur zur Ansicht angezeigt.
          </p>
        </Section>
      )}

      <div className={styles.layout}>
        <div ref={canvasAreaRef} className={styles.canvasArea}>
          <div className={styles.canvasWrapper} style={{ width: version.width * zoom, height: version.height * zoom }}>
            <div
              className={styles.canvas}
              style={{
                width: version.width,
                height: version.height,
                transform: `scale(${zoom})`,
              }}
            >
              {/* Mirrors RenderEngineService.RenderProjectVersion: a hidden
                  layer is skipped entirely from the preview, same as the
                  actual render, not just dimmed - so what's shown here
                  never overstates what the final image will contain. */}
              {layers.filter((layer) => !layer.hidden).map((layer) => {
                const matrix = resolveMatrix(layer.transformationMatrix, testParameters);
                const resolvedOptions = resolveOptions(layer.options, testParameters);

                return (
                  <div
                    key={layer.id}
                    ref={(el) => setLayerRef(layer.id, el)}
                    className={clsx(styles.layerTarget, selectedLayerId === layer.id && styles.selected, !isEditable && styles.locked)}
                    style={{ transform: toCssMatrix(matrix) }}
                    onClick={() => isEditable && setSelectedLayerId(layer.id)}
                  >
                    <LayerElement layer={layer} resolved={resolvedOptions} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <Section name="Ebenen (Reihenfolge)">
            <DndContext sensors={layerListSensors} collisionDetection={closestCenter} onDragEnd={handleLayerDragEnd}>
              <SortableContext items={displayLayers.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <List>
                  {displayLayers.map((layer, index) => (
                    <SortableLayerRow
                      key={layer.id}
                      layer={layer}
                      index={index}
                      rowCount={displayLayers.length}
                      selected={selectedLayerId === layer.id}
                      isEditable={isEditable}
                      onSelect={() => setSelectedLayerId(layer.id)}
                      onReorder={(direction) => handleReorder(layer.id, direction)}
                      onToggleHidden={() => handleToggleHidden(layer.id)}
                    />
                  ))}
                </List>
              </SortableContext>
            </DndContext>
          </Section>

          {isEditable && (
            <AddLayerForm
              projectId={projectId}
              versionId={versionId}
              nextOrder={layers.length}
              onCreated={(layer) => setLayers((prev) => [...prev, layer])}
            />
          )}

          {isEditable && selectedLayer && (
            <>
              {geometryLocked && (
                <p className={styles.lockedNotice}>
                  Position/Rotation dieser Ebene ist an einen Parameter gebunden und kann hier nicht bearbeitet werden.
                </p>
              )}
              {selectedGeometry && (
                <LayerGeometryPanel geometry={selectedGeometry} hasSize={canResize} onChange={handleGeometryPanelChange} />
              )}
              <LayerPropertiesPanel
                layer={selectedLayer}
                parameterPaths={parameterPaths}
                onChangeName={(name) => handleChangeName(selectedLayer.id, name)}
                onChangeOptions={(options) => handleChangeOptions(selectedLayer.id, options)}
                onDelete={() => handleDelete(selectedLayer.id)}
              />
            </>
          )}
        </div>
      </div>

      {isEditable && selectedTarget && !geometryLocked && (
        <Moveable
          ref={moveableRef}
          target={selectedTarget}
          container={moveableContainerRef.current}
          zoom={zoom}
          draggable
          rotatable
          resizable={canResize}
          renderDirections={['e', 's', 'se']}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          onResizeStart={handleResizeStart}
          onResize={handleResize}
          onResizeEnd={handleResizeEnd}
          onRotateStart={handleRotateStart}
          onRotate={handleRotate}
          onRotateEnd={handleRotateEnd}
        />
      )}
    </div>
  );
};

export default LayerCanvasEditor;
