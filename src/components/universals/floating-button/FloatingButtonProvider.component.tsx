'use client';

import React, { PropsWithChildren, useCallback, useMemo, useRef } from 'react';
import {
  FloatingButtonProviderContext,
  TFloatingButtonListener,
  TFloatingButtonProviderContext,
} from "@/components/universals/floating-button/FloatingButtonProvider.context";

const FloatingButtonProvider: React.FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const listenersRef = useRef<Map<string, Set<TFloatingButtonListener>>>(new Map());

  const registerListener = useCallback((id: string, listener: TFloatingButtonListener) => {
    let listeners = listenersRef.current.get(id);
    if (!listeners) {
      listeners = new Set();
      listenersRef.current.set(id, listeners);
    }
    listeners.add(listener);

    return () => {
      listeners?.delete(listener);
    };
  }, []);

  const triggerClick = useCallback((id: string) => {
    listenersRef.current.get(id)?.forEach((listener) => listener());
  }, []);

  const floatingButtonProviderContext = useMemo((): TFloatingButtonProviderContext => ({
    registerListener,
    triggerClick,
  }), [registerListener, triggerClick]);

  return (
    <FloatingButtonProviderContext value={floatingButtonProviderContext}>
      {children}
    </FloatingButtonProviderContext>
  );
};

export default FloatingButtonProvider;
