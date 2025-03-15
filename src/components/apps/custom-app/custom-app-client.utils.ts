'use client';

import {
  TCustomAppClickHandlerFunc,
} from "@/components/apps/custom-app/custom-app.type";
import { useCallback } from "react";

function useClickHandler(
  handler: TCustomAppClickHandlerFunc,
) {
  return useCallback(async () => {
    const searchQueryParams = new URLSearchParams(window.location.search);

    return await handler({
      query: Object.fromEntries(searchQueryParams.entries()),
    });
  }, [handler])
}

export const customAppClientUtils = {
  useClickHandler,
};
