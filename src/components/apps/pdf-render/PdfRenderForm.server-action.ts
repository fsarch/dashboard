'use server';

import { fetchService } from "@/utils/fetchService";
import { getCurrentServiceId, getCurrentServiceType, getDefaultServiceId } from "@/utils/configuration.utils";
import { EServiceType } from "@/utils/configuration.type";

export type TPdfRenderFormData = {
  content: {
    html: string;
  };
  options: {
    viewport: {
      width: number;
      height: number;
    };
    export: {
      format: string;
      width?: string | number;
      height?: string | number;
    };
  };
};

export const renderPdf = async (data: TPdfRenderFormData) => {
  const currentServiceId = await getCurrentServiceId();
  const currentServiceType = await getCurrentServiceType();

  let serviceId = currentServiceId;
  if (currentServiceType !== EServiceType.PDF_RENDER) {
    serviceId = await getDefaultServiceId(EServiceType.PDF_RENDER);
  }

  const res = await fetchService('/pdf/_actions/render', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }, {
    serviceId,
  });

  if (!res.ok) {
    console.error({
      message: 'invalid response code from pdf-render-server',
      data: {
        status: res.status,
      },
    });
    throw new Error('invalid status code from upstream service while generating pdf');
  }

  const bodyArrayBuffer = await res.arrayBuffer();

  const base64 = Buffer.from(bodyArrayBuffer).toString('base64');

  return {
    base64,
  };
};
