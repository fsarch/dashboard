'use client';

import React, { useEffect, useState } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import styles from './SwaggerUIClient.module.scss';

type SwaggerUIClientProps = {
  serviceId: string;
  specUrl: string;
  themeMode: 'light' | 'dark';
};

type SwaggerUIComponent = React.ComponentType<{
  url?: string;
  requestInterceptor?: (req: { headers?: Record<string, string>; url: string }) => { headers?: Record<string, string>; url: string };
}>;

// Dynamically import swagger-ui-react to avoid SSR issues
const SwaggerUIClient: React.FunctionComponent<SwaggerUIClientProps> = ({
  serviceId,
  specUrl,
  themeMode,
}) => {
  const [SwaggerUI, setSwaggerUI] = useState<{ Component: SwaggerUIComponent } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('swagger-ui-react')
      .then((mod) => {
        setSwaggerUI({ Component: mod.default as unknown as SwaggerUIComponent });
      })
      .catch((err) => {
        setError(`Swagger UI konnte nicht geladen werden: ${err.message}`);
      });
  }, []);

  const requestInterceptor = React.useCallback(
    (req: { headers?: Record<string, string>; url: string }) => {
      if (!req.headers) {
        req.headers = {};
      }

      const absoluteSpecUrl = new URL(specUrl, window.location.origin).toString();
      const isSpecRequest = req.url === specUrl || req.url === absoluteSpecUrl;
      const isAlreadyProxied = req.url.startsWith('/api/v1/development/service-proxy/');

      if (!isSpecRequest && !isAlreadyProxied) {
        const requestUrl = new URL(req.url, window.location.origin);
        const targetPath = `${requestUrl.pathname}${requestUrl.search}`;
        req.url = `/api/v1/development/service-proxy/${serviceId}?target=${encodeURIComponent(targetPath)}`;
      }

      return req;
    },
    [serviceId, specUrl],
  );

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!SwaggerUI) {
    return <div className={styles.loading}>Swagger UI wird geladen…</div>;
  }

  const { Component } = SwaggerUI;

  return (
    <div className={styles.root} data-theme-mode={themeMode}>
      <Component
        url={specUrl}
        requestInterceptor={requestInterceptor}
      />
    </div>
  );
};

export default SwaggerUIClient;

