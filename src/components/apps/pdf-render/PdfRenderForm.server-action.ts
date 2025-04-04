'use server';

import { fetchService } from "@/utils/fetchService";

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
    };
  };
};

export const renderPdf = async (data: TPdfRenderFormData) => {
  console.log('data', data);
  const res = await fetchService('/pdf/_actions/render', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
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
