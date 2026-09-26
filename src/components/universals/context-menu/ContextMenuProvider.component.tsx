'use client';

import type React from 'react';
import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ContextMenuProviderContext,
  type TContextMenuProviderContext,
} from '@/components/universals/context-menu/ContextMenuProvider.context';
import type { TContextMenuComponent } from '@/components/universals/context-menu/contextMenu.type';
import styles from './ContextMenuProvider.module.scss';

type TActiveContextMenu = {
  id: string;
  component: TContextMenuComponent<unknown>;
  value: unknown;
  position: { x: number; y: number };
};

// Minimum distance kept to the viewport edge when clamping the menu position.
const VIEWPORT_MARGIN = 8;

const ContextMenuProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [activeMenu, setActiveMenu] = useState<TActiveContextMenu | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const handleClose = useCallback((id: string) => {
    // Only clears the menu if it's still the one that was asked to close -
    // avoids a stale close() (e.g. from an async dialog result) hiding a menu
    // that was already replaced by a newer one.
    setActiveMenu((current) => (current?.id === id ? null : current));
  }, []);

  const openContextMenu = useCallback(
    (
      component: TContextMenuComponent<unknown>,
      value: unknown,
      event: React.MouseEvent,
    ) => {
      const id = crypto.randomUUID();

      setActiveMenu({
        id,
        component,
        value,
        position: { x: event.clientX, y: event.clientY },
      });

      return {
        id,
        close: () => handleClose(id),
      };
    },
    [handleClose],
  );

  const contextMenuProviderContext = useMemo(
    (): TContextMenuProviderContext => ({
      openContextMenu,
    }),
    [openContextMenu],
  );

  // Clamps the menu into the viewport once its rendered size is known - runs
  // before paint so there's no visible jump from the raw cursor position.
  useLayoutEffect(() => {
    if (!activeMenu) {
      setMenuStyle({});
      return;
    }

    const element = menuRef.current;
    if (!element) {
      return;
    }

    const { width, height } = element.getBoundingClientRect();
    const x = Math.min(
      activeMenu.position.x,
      window.innerWidth - width - VIEWPORT_MARGIN,
    );
    const y = Math.min(
      activeMenu.position.y,
      window.innerHeight - height - VIEWPORT_MARGIN,
    );

    setMenuStyle({
      left: Math.max(VIEWPORT_MARGIN, x),
      top: Math.max(VIEWPORT_MARGIN, y),
    });
  }, [activeMenu]);

  useEffect(() => {
    if (!activeMenu) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose(activeMenu.id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeMenu, handleClose]);

  const Component = activeMenu?.component;

  return (
    <ContextMenuProviderContext value={contextMenuProviderContext}>
      {children}
      {activeMenu ? (
        <>
          <div
            className={styles.overlay}
            onClick={() => handleClose(activeMenu.id)}
            onContextMenu={(event) => {
              event.preventDefault();
              handleClose(activeMenu.id);
            }}
          />
          <div ref={menuRef} className={styles.menu} style={menuStyle}>
            {Component ? (
              <Component
                value={activeMenu.value}
                close={() => handleClose(activeMenu.id)}
              />
            ) : null}
          </div>
        </>
      ) : null}
    </ContextMenuProviderContext>
  );
};

export default ContextMenuProvider;
