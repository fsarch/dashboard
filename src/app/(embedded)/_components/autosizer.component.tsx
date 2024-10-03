'use client';

import React, { PropsWithChildren, useEffect } from 'react';

type AutoSizerProps = PropsWithChildren<{

}>;

const AutoSizer: React.FunctionComponent<AutoSizerProps> = ({
  children,
}) => {
  useEffect(() => {
    const sendHeight = () => {
      const body = document.body,
        html = document.documentElement;

      const height = Math.max( body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight );

      window.parent.postMessage({
        type: 'resize',
        payload: height,
      }, '*');
    };

    const interval = setInterval(() => {
      sendHeight();
    }, 10000);

    sendHeight();

    return () => {
      clearInterval(interval);
    }
  }, []);

  return children;
};

export default AutoSizer;
