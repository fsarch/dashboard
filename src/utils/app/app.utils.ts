import { TIcon } from "@/components/universals/icon/Icon.type";

export type AppType = { icon?: TIcon; name: string; path: string; };

const apps: Array<AppType> = [{
  icon: 'tag',
  name: 'Product',
  path: '/product',
},/* {
  icon: 'table',
  name: 'DataTable',
  path: '/datatable',
}, {
  icon: 'message',
  name: 'Customer Communication',
  path: '/ccm',
},*/ {
  icon: 'image',
  name: 'Image Server',
  path: '/image',
}, {
  icon: 'industry',
  name: 'Material Tracing',
  path: '/material-tracing',
}, {
  icon: 'file-pdf',
  name: 'PDF Render',
  path: '/pdf-render',
}, {
  icon: 'code',
  name: 'Functions',
  path: '/function',
}, {
  icon: 'print',
  name: 'Printer',
  path: '/printer',
}, {
  icon: 'floppy-disk',
  name: 'Backup',
  path: '/backup',
}]

const getApps = async () => {
  return apps;
};

export const appUtils = {
  getApps,
};
