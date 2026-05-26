'use client';

import dynamic from 'next/dynamic';

const EditorDynamic = dynamic(() => import('./Editor.component'), {
  ssr: false,
});

export default EditorDynamic;

